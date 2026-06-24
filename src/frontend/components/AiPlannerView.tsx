"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { saveItineraryAction } from '../../backend/actions/shareActions';
import { TOURS_DATA } from '../data';
import { Tour } from '../types';
import { parseBudgetRange } from '../utils/budget';
import { trackPlannerCompletion } from '../utils/analytics';
import { LOADING_MESSAGES, DURATION_OPTIONS } from './planner/constants';
import PlannerWizard from './planner/PlannerWizard';
import PlannerResult from './planner/PlannerResult';

interface AiPlannerViewProps {
  onSaveItinerary?: (itin: any) => void;
  loadedItinerary?: any;
  onClearLoadedItinerary?: () => void;
  allTours?: Tour[];
}

export default function AiPlannerView({
  onSaveItinerary,
  loadedItinerary,
  onClearLoadedItinerary,
  allTours = []
}: AiPlannerViewProps) {
  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [itineraryResult, setItineraryResult] = useState<any>(null);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const { data: session } = useSession();

  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [fromLocation, setFromLocation] = useState('');

  const [customBudgetAmount, setCustomBudgetAmount] = useState(15000);

  const selectedTour = selectedDestination ? (allTours.find(t => t.id === selectedDestination || t.dbId === selectedDestination) || TOURS_DATA.find(t => t.id === selectedDestination)) : null;
  const destBudgetRange = selectedTour ? parseBudgetRange(selectedTour.budgetRange) : null;
  const budgetSliderMin = Math.max(5000, destBudgetRange?.min || 5000);
  const budgetSliderMax = destBudgetRange?.max || 60000;

  const derivedBudgetTier = useMemo(() => {
    if (customBudgetAmount <= 15000) return 'Small';
    if (customBudgetAmount <= 40000) return 'Medium';
    return 'Luxury';
  }, [customBudgetAmount]);

  useEffect(() => {
    if (destBudgetRange) {
      const mid = Math.round((destBudgetRange.min + destBudgetRange.max) / 2 / 500) * 500;
      setCustomBudgetAmount(mid);
    }
  }, [selectedDestination]);

  const getDestinationPrettyName = (destId: string | null | undefined): string => {
    if (!destId) return 'Curated Destination';
    if (allTours && allTours.length > 0) {
      const tourObj = allTours.find(t => t.id === destId || t.dbId === destId);
      if (tourObj) return tourObj.title;
    }
    const staticTour = TOURS_DATA.find(t => t.id === destId || t.dbId === destId);
    if (staticTour) return staticTour.title;
    if (destId.includes('-')) {
      const part = destId.split('-')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return destId;
  };

  const [travelers, setTravelers] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(5);
  const [notes, setNotes] = useState("");

  const totalSteps = 5;

  useEffect(() => {
    if (loadedItinerary) {
      setHasStarted(true);
      const savedData = loadedItinerary.itinerary;
      if (savedData && savedData.days) {
        setItineraryResult({
          itinerary: savedData.days,
          costs: savedData.costs,
          weather: savedData.weather,
          nearbyPlaces: savedData.nearbyPlaces,
          recommendationScore: savedData.recommendationScore || 96,
          recommendationReasoning: savedData.recommendationReasoning || "",
          destinationId: loadedItinerary.destination,
        });
        setNotes(savedData.notes || "");
      } else {
        setItineraryResult({
          itinerary: Array.isArray(savedData) ? savedData : [],
          costs: {
            transit: 12000,
            stay: loadedItinerary.budget ? loadedItinerary.budget * loadedItinerary.duration * 0.6 : 25000,
            food: loadedItinerary.budget ? loadedItinerary.budget * loadedItinerary.duration * 0.4 : 15000,
            total: loadedItinerary.budget ? loadedItinerary.budget * loadedItinerary.duration : 52000
          },
          weather: { temperature: "24°C - 28°C", conditions: "Clear & Pleasant" },
          recommendationScore: 96,
          recommendationReasoning: "Imported travel pass.",
          destinationId: loadedItinerary.destination,
        });
        setNotes("");
      }
      setCustomBudgetAmount(loadedItinerary.budget || 1500);
      setDuration(loadedItinerary.duration <= 3 ? 'weekend' : loadedItinerary.duration <= 7 ? 'week' : 'extended');
      setTravelers('solo');
      setMood('Relaxation');
      setSavedId(loadedItinerary.id);
      setSelectedDestination(loadedItinerary.destination || null);
    }
  }, [loadedItinerary]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleDurationSelect = (id: string) => {
    setDuration(id);
    const found = DURATION_OPTIONS.find(o => o.id === id);
    if (found) {
      setCustomDuration(found.days);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStepIndex(0);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
      setLoadingStepIndex(msgIndex);
    }, 1800);

    let timeoutId: ReturnType<typeof setTimeout>;
    try {
      const destName = selectedDestination ? (TOURS_DATA.find(t => t.id === selectedDestination)?.title || selectedDestination) : 'Unknown';
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 90000);
      const res = await fetch('/api/plan-trip', {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          fromLocation: fromLocation || undefined,
          guests: travelers === 'solo' ? 1 : travelers === 'couple' ? 2 : travelers === 'family' ? 4 : 6,
          companion: travelers || 'solo',
          budget: derivedBudgetTier,
          budgetAmount: customBudgetAmount,
          travelStyle: mood,
          fromDate: new Date().toISOString(),
          toDate: new Date(Date.now() + customDuration * 24 * 60 * 60 * 1000).toISOString(),
          travelPace: 'Moderate',
          interests: energy || '',
          experience: '',
        })
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      clearInterval(msgInterval);
      if (!mountedRef.current) return;
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setItineraryResult(data);
      trackPlannerCompletion(selectedDestination || '', customDuration, derivedBudgetTier);
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearInterval(msgInterval);
      if (!mountedRef.current) return;
      setLoading(false);
      console.error("AI Generation failed:", err);
      const friendlyMsg = "We're consulting our explorer archive and preparing an alternative journey.";
      setItineraryResult({ error: friendlyMsg });
    }
  };

  const handleSave = async () => {
    if (!itineraryResult || itineraryResult.error) return;
    if (!session) {
      signIn('google', { callbackUrl: window.location.href });
      return;
    }
    setSaving(true);
    try {
      const destId = itineraryResult.destinationId || selectedDestination || '';
      const destPrettyName = getDestinationPrettyName(destId);
      const result = await saveItineraryAction({
        title: `Journal: Escape to ${destPrettyName}`,
        destination: destId,
        budget: customBudgetAmount,
        duration: customDuration,
        itinerary: {
          days: itineraryResult.itinerary || [],
          costs: itineraryResult.costs || {},
          weather: itineraryResult.weather || {},
          nearbyPlaces: itineraryResult.nearbyPlaces || [],
          notes: notes,
          recommendationScore: itineraryResult.recommendationScore || 96,
          recommendationReasoning: itineraryResult.recommendationReasoning || "",
        },
      });
      if (result.success) {
        setSavedId(result.id || 'saved');
        if (onSaveItinerary) {
          onSaveItinerary({
            id: result.id,
            title: `Journal: Escape to ${destPrettyName}`,
            destination: destId,
            budget: customBudgetAmount,
            duration: customDuration,
            itinerary: {
              days: itineraryResult.itinerary || [],
              costs: itineraryResult.costs || {},
              weather: itineraryResult.weather || {},
              nearbyPlaces: itineraryResult.nearbyPlaces || [],
              notes: notes,
              recommendationScore: itineraryResult.recommendationScore || 96,
              recommendationReasoning: itineraryResult.recommendationReasoning || "",
            },
            destinationName: destPrettyName,
          });
        }
      }
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Could not save your journey. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setHasStarted(false);
    setSelectedDestination(null);
    setTravelers(null);
    setMood(null);
    setEnergy(null);
    setDuration(null);
    setItineraryResult(null);
    setActiveDayTab(0);
    setSavedId(null);
    setNotes("");
    if (onClearLoadedItinerary) {
      onClearLoadedItinerary();
    }
  };

  const getJourneyPersona = () => {
    const compLabel = travelers === 'solo' ? 'Nomad' : travelers === 'couple' ? 'Romantic' : travelers === 'family' ? 'Family Oriented' : 'Group Explorers';
    let moodLabel = 'Explorer';
    if (mood === 'Adventure') moodLabel = 'Seeker';
    else if (mood === 'Relaxation') moodLabel = 'Restorer';
    else if (mood === 'Luxury') moodLabel = 'Connoisseur';
    else if (mood === 'Food') moodLabel = 'Epicurean';
    else if (mood === 'Culture') moodLabel = 'Philosopher';
    return `${compLabel} ${moodLabel}`;
  };

  if (loading) {
    return (
      <div className="pt-28 pb-32 px-6 max-w-lg mx-auto min-h-[100dvh] bg-background flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-20 mb-6 flex items-center justify-center">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className="text-teal">
            <motion.path
              d="M 10 30 Q 30 10 60 30 T 110 30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Start Node */}
            <motion.circle cx="10" cy="30" r="4.5" fill="var(--color-gold)" 
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            {/* Mid Node */}
            <motion.circle cx="60" cy="30" r="4.5" fill="var(--color-teal)" 
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
            {/* End Node */}
            <motion.circle cx="110" cy="30" r="4.5" fill="var(--color-coral)" 
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
          </svg>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-coral block mb-2 font-bold animate-pulse">
          Crafting Journey
        </span>
        <h2 className="font-display text-3xl font-light text-night lowercase leading-none mb-3">
          {loadingMsg}
        </h2>
        <div className="w-full bg-border h-1 rounded-full overflow-hidden max-w-[200px]">
          <div
            className="bg-teal h-full transition-all duration-700 ease-out"
            style={{ width: `${((loadingStepIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (itineraryResult) {
    return (
      <PlannerResult
        itineraryResult={itineraryResult}
        customDuration={customDuration}
        travelers={travelers}
        derivedBudgetTier={derivedBudgetTier}
        customBudgetAmount={customBudgetAmount}
        fromLocation={fromLocation}
        selectedDestination={selectedDestination}
        savedId={savedId}
        saving={saving}
        activeDayTab={activeDayTab}
        onActiveDayTabChange={setActiveDayTab}
        onSave={handleSave}
        onReset={handleReset}
        getJourneyPersona={getJourneyPersona}
        getDestinationPrettyName={getDestinationPrettyName}
      />
    );
  }

  const previewPersona = travelers && mood
    ? `${travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : 'Group'} ${mood} Journey`
    : travelers
    ? `${travelers === 'solo' ? 'Solo Explorer' : travelers === 'couple' ? 'Couple Escape' : travelers === 'family' ? 'Family Journey' : 'Group Adventure'}`
    : selectedDestination
    ? 'Building your journey...'
    : 'Select a destination to begin';

  return (
    <PlannerWizard
      step={step}
      mood={mood}
      travelers={travelers}
      selectedDestination={selectedDestination}
      fromLocation={fromLocation}
      energy={energy}
      duration={duration}
      customDuration={customDuration}
      customBudgetAmount={customBudgetAmount}
      budgetSliderMin={budgetSliderMin}
      budgetSliderMax={budgetSliderMax}
      notes={notes}
      hasStarted={hasStarted}
      selectedTour={selectedTour}
      previewPersona={previewPersona}
      onMoodChange={setMood}
      onTravelersChange={setTravelers}
      onDestinationChange={setSelectedDestination}
      onFromLocationChange={setFromLocation}
      onEnergyChange={setEnergy}
      onDurationChange={(id) => {
        setDuration(id);
        const found = DURATION_OPTIONS.find(o => o.id === id);
        if (found) setCustomDuration(found.days);
      }}
      onBudgetChange={setCustomBudgetAmount}
      onNotesChange={setNotes}
      onStart={() => setHasStarted(true)}
      onNext={handleNext}
      onBack={handleBack}
      onGenerate={handleGenerate}
    />
  );
}