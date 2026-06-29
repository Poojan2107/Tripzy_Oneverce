"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  onSaveItinerary?: (itin: any, skipRedirect?: boolean) => void;
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    setLoadingMsg(LOADING_MESSAGES[0]);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < LOADING_MESSAGES.length - 1) {
        msgIndex++;
        setLoadingMsg(LOADING_MESSAGES[msgIndex]);
        setLoadingStepIndex(msgIndex);
      }
    }, 2800);

    let timeoutId: ReturnType<typeof setTimeout>;
    try {
      const destName = selectedDestination ? (TOURS_DATA.find(t => t.id === selectedDestination)?.title || selectedDestination) : 'Unknown';
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 12000);
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
          travelStyle: mood || 'Relaxation',
          fromDate: new Date().toISOString(),
          toDate: new Date(Date.now() + customDuration * 24 * 60 * 60 * 1000).toISOString(),
          travelPace: 'Moderate',
          interests: energy || '',
          experience: notes,
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

  const handleContinueWithGoogle = () => {
    setShowAuthModal(false);
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleMaybeLater = () => {
    setShowAuthModal(false);
    const destId = itineraryResult.destinationId || selectedDestination || '';
    const destPrettyName = getDestinationPrettyName(destId);
    const localId = 'local-' + Date.now();
    
    const localItin = {
      id: localId,
      title: `Journal: Escape to ${destPrettyName} (Local Draft)`,
      destination: destId,
      budget: customBudgetAmount,
      duration: customDuration,
      companions: travelers || 'solo',
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
    };
    
    setSavedId(localId);
    if (onSaveItinerary) {
      onSaveItinerary(localItin, true);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    if (!itineraryResult || itineraryResult.error) return;
    if (!session) {
      setShowAuthModal(true);
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
      } else {
        alert(result.error || "Your journey could not be saved right now. Your explorer journal remains safe locally. Please try again shortly.");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Your journey could not be saved right now. Your explorer journal remains safe locally. Please try again shortly.");
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
        <span className="font-mono text-micro uppercase tracking-[0.25em] text-coral block mb-2 font-bold animate-pulse">
          Journey Companion
        </span>
        <h2 className="font-display text-3xl font-light text-night lowercase leading-none mb-6">
          {loadingMsg}
        </h2>

        {/* Dynamic Checklist Loader */}
        <div className="w-full max-w-xs space-y-3.5 text-left border-t border-border/40 pt-6">
          {LOADING_MESSAGES.map((msg, i) => {
            const isDone = loadingStepIndex > i;
            const isCurrent = loadingStepIndex === i;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isDone 
                    ? 'bg-gold border-gold text-night font-bold shadow-[0_0_8px_rgba(244,182,61,0.2)]' 
                    : isCurrent 
                      ? 'bg-teal border-teal text-white shadow-[0_0_10px_rgba(24,182,201,0.3)]' 
                      : 'border-border/60 bg-background text-transparent'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3] text-night" />
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ) : null}
                </div>
                <span className={`text-xs font-sans transition-colors duration-300 ${
                  isDone ? 'text-muted/50 line-through font-light' : isCurrent ? 'text-night font-bold' : 'text-muted/30 font-light'
                }`}>
                  {msg}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (itineraryResult) {
    return (
      <>
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

        {/* LIGHTWEIGHT AUTH EXPLANATION MODAL */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              
              <motion.div className="bg-white border border-border/50 rounded-3xl shadow-elevated p-6 max-w-sm w-full relative z-10 text-night text-left space-y-5"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}>
                
                <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-light lowercase leading-tight">Save this journey to your Passport</h3>
                    <p className="text-micro font-mono text-muted uppercase tracking-widest mt-0.5">Explorer Passport Sync</p>
                  </div>
                </div>

                <div className="space-y-2.5 py-1">
                  <p className="text-small text-muted/80 leading-relaxed font-sans font-light">
                    Save your AI-crafted odyssey to access it anytime and build your explorer achievements.
                  </p>
                  <ul className="text-xs space-y-2 text-night/85 font-sans font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span>Sync across all your devices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                      <span>Preserve your explorer journal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                      <span>Build your travel collection</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={handleContinueWithGoogle}
                    className="w-full py-3 rounded-xl bg-night text-white text-micro font-bold uppercase tracking-wider hover:bg-night transition-colors cursor-pointer flex items-center justify-center gap-2 border-none shadow-sm min-h-[44px]"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    onClick={handleMaybeLater}
                    className="w-full py-3 rounded-xl border border-border/40 bg-white hover:bg-background text-muted hover:text-night text-micro font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
                  >
                    Maybe Later
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS TOAST */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              className="fixed bottom-5 right-5 z-[100] bg-night text-white px-5 py-3 rounded-2xl shadow-elevated border border-white/10 flex items-center gap-2 font-mono text-micro uppercase tracking-widest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Journey saved locally to your Passport!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </>
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