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
import { useToast } from '../components/ui/Toast';
import { LOADING_MESSAGES, DURATION_OPTIONS } from './planner/constants';
import { buildOfflineResponse } from '../../backend/data/offlineItineraries';
import PlannerWizard from './planner/PlannerWizard';
import PlannerResult from './planner/PlannerResult';
import PlannerLoadingSkeleton from './planner/PlannerLoadingSkeleton';

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
  const { toast } = useToast();
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

const sanitizeUserInput = (input: string) => {
  // 1. Remove control characters and null bytes
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, "");
  
  // 2. Basic Prompt Injection shield: detect common hijack patterns
  const injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /forget (everything )?i told you/i,
    /you are now a/i,
    /system prompt/i,
    /act as a/i,
    /new instructions/i,
  ];
  
  if (injectionPatterns.some(pattern => pattern.test(sanitized))) {
    return "User requested a custom journey with specific preferences."; // Replace with generic safe string
  }
  
  return sanitized.trim();
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
    if (id === 'custom') return;
    const found = DURATION_OPTIONS.find(o => o.id === id);
    if (found) {
      setCustomDuration(found.days);
    }
  };

  const buildClientOfflineResponse = (
    destination: string | null,
    selectedTour: any,
    derivedBudgetTier: string,
    customBudgetAmount: number,
    customDuration: number,
    travelers: string | null,
    mood: string | null,
    fromLocation: string,
    notes: string
  ) => {
    const safeDestName = (selectedTour?.title || destination || "Varanasi").trim() || "this hidden gem";
    const fallbackDestName = safeDestName;
    const fallbackLat = selectedTour?.latitude ?? 25.3176;
    const fallbackLng = selectedTour?.longitude ?? 82.9739;
    const safeCustomDuration = Math.max(1, customDuration || 4);

    const itinerary = [];
    const baseDays = selectedTour?.itinerary || [
      {
        title: `Arrival & Heritage Walk in ${fallbackDestName}`,
        description: `Welcome to ${fallbackDestName}! Check into your accommodation and head out for a gentle orientation walking tour. Discover the local streets, hidden culinary spots, and meet welcoming locals.`,
        activities: ["Check-in & relax", "Guided orientation walk", "Welcome regional dinner"]
      },
      {
        title: `Cultural Immersive Experience`,
        description: `Dive deeper into the local art, history, and craft traditions of ${fallbackDestName}. Visit major landmarks, museums, and workshop areas to watch local artisans at work.`,
        activities: ["Landmark sightseeing tour", "Artisan workshop visit", "Sunset viewpoint hike"]
      },
      {
        title: `Nature & Surrounding Excursion`,
        description: `Explore the scenic countryside or natural wonders surrounding ${fallbackDestName}. Enjoy a quiet morning hike or lake boat cruise, and sample traditional farm-to-table delicacies.`,
        activities: ["Nature park exploration", "Scenic countryside drive", "Farm-to-table lunch"]
      },
      {
        title: `Signature Experience & Farewell`,
        description: `Spend your final day checking out local secrets, picking up artisan souvenirs, and enjoying a signature cooking class or musical performance to close your trip.`,
        activities: ["Local secret discovery", "Souvenir shopping in craft market", "Farewell dinner & show"]
      }
    ];

    for (let i = 0; i < safeCustomDuration; i++) {
      const baseDay = baseDays[i % baseDays.length];
      const cycle = Math.floor(i / baseDays.length);
      const dayIndex = i + 1;
      itinerary.push({
        day: `Day ${dayIndex}`,
        title: baseDay.title,
        description: baseDay.description,
        activities: baseDay.activities || [],
        latitude: fallbackLat + (cycle * 0.012) + (i * 0.003),
        longitude: fallbackLng - (cycle * 0.012) - (i * 0.003)
      });
    }

    const safeBudgetAmount = Math.max(5000, customBudgetAmount ?? 0);
    const dailyBudget = safeBudgetAmount || (derivedBudgetTier === "Luxury" ? 35000 : derivedBudgetTier === "Medium" ? 15000 : 5000);
    const transitCost = Math.round(dailyBudget * customDuration * 0.25);
    const stayCost = Math.round(dailyBudget * customDuration * 0.45);
    const foodCost = Math.round(dailyBudget * customDuration * 0.20);
    const totalCost = transitCost + stayCost + foodCost;

    return {
      itinerary,
      costs: {
        transit: transitCost,
        stay: stayCost,
        food: foodCost,
        total: totalCost
      },
      weather: {
        temperature: "22°C - 26°C",
        conditions: "Pleasant & Clear"
      },
      nearbyPlaces: [
        {
          name: "Historic Heritage Quarter",
          distance: "2km",
          description: "An ancient enclave rich in classical vernacular architecture."
        }
      ],
      destinationId: selectedTour?.id || destination || undefined,
      recommendationScore: 92,
      recommendationReasoning: "Curated from our offline explorer archive.",
      isOfflineFallback: true
    };
  };

  const handleGenerate = () => {
    // Launch async work as a detached IIFE so it fires-and-forgets.
    // PlannerWizard calls onGenerate() without await \u2014 matching () => void.
    // The parent sets loading=true synchronously, which unmounts the wizard cleanly.
    (async () => {

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

    const makeAttempt = async (): Promise<any> => {
      const destName = selectedDestination ? (TOURS_DATA.find(t => t.id === selectedDestination)?.title || selectedDestination) : 'Unknown';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
      const res = await fetch('/api/plan-trip', {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          fromLocation: fromLocation ? sanitizeUserInput(fromLocation) : undefined,
          guests: travelers === 'solo' ? 1 : travelers === 'couple' ? 2 : travelers === 'family' ? 4 : 6,
          companion: travelers || 'solo',
          budget: derivedBudgetTier,
          budgetAmount: customBudgetAmount,
          travelStyle: mood || 'Relaxation',
          fromDate: new Date().toISOString(),
          toDate: new Date(Date.now() + customDuration * 24 * 60 * 60 * 1000).toISOString(),
          travelPace: 'Moderate',
          interests: energy || '',
          experience: sanitizeUserInput(notes),
        })
      });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error: ${res.status}`);
        }
        
        return await res.json();
      } catch (err: any) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    try {
      const data = await makeAttempt();
      clearInterval(msgInterval);
      if (!mountedRef.current) return;
      setLoading(false);
      setItineraryResult(data);
      trackPlannerCompletion(selectedDestination || '', customDuration, derivedBudgetTier);
    } catch (err: any) {
      console.warn("AI Generation attempt 1 failed:", err);
      if (!mountedRef.current) {
        clearInterval(msgInterval);
        return;
      }

      // First failure: Wait slightly and trigger auto-retry with visual indicator
      setLoadingMsg("Consulting alternative archives... Retrying (Attempt 2/2)...");
      await new Promise(r => setTimeout(r, 1500));

      try {
        const data = await makeAttempt();
        clearInterval(msgInterval);
        if (!mountedRef.current) return;
        setLoading(false);
        setItineraryResult(data);
        trackPlannerCompletion(selectedDestination || '', customDuration, derivedBudgetTier);
      } catch (retryErr: any) {
        clearInterval(msgInterval);
        if (!mountedRef.current) return;
        setLoading(false);
        console.error("AI Generation attempt 2 failed:", retryErr);

        // Fall back to client-side offline response
        let errorType: "timeout" | "server" | "network" = "server";
        if (retryErr.name === "AbortError" || err.name === "AbortError") {
          errorType = "timeout";
        } else if (retryErr.message?.includes("Failed to fetch") || !window.navigator.onLine) {
          errorType = "network";
        }

        const fallback = buildClientOfflineResponse(
          selectedDestination,
          selectedTour,
          derivedBudgetTier,
          customBudgetAmount,
          customDuration,
          travelers,
          mood,
          fromLocation,
          notes
        );

        (fallback as any).fallbackErrorType = errorType;
        setItineraryResult(fallback);
      }
    }
    })(); // end detached async IIFE
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
        toast(result.error || "Your journey could not be saved right now.", "error");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      toast("Your journey could not be saved right now.", "error");
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
  };  if (loading) {
    return (
      <div className="bg-background text-night select-none text-left pt-24 pb-24 min-h-[100dvh] font-sans">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          {/* Skeleton Hero / Header */}
          <div className="bg-surface border border-border/70 rounded-lg p-6 sm:p-8 shadow-md relative overflow-hidden animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-border/15">
              <div className="space-y-3 text-left w-full sm:w-2/3">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-border/80 animate-ping" />
                  <div className="h-3 w-40 bg-border rounded-sm" />
                </div>
                <div className="h-8 w-3/4 bg-border rounded-md mt-2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-6 w-16 bg-border rounded-sm" />
                  <div className="h-6 w-20 bg-border rounded-sm" />
                  <div className="h-6 w-24 bg-border rounded-sm" />
                </div>
              </div>
              <div className="h-10 w-32 bg-border rounded-md shrink-0 self-start sm:self-center" />
            </div>
            <div className="h-4 w-5/6 bg-border/60 rounded-sm mt-4" />
          </div>

          {/* Skeleton Story Timeline Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-28 bg-border rounded-sm animate-pulse" />
              <div className="h-px flex-1 bg-border/20" />
            </div>

            {/* Skeleton Day Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Array(customDuration || 4).fill(null).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-14 rounded-md border border-border/40 bg-surface/50 animate-pulse"
                >
                  <div className="h-5 w-5 bg-border rounded-full" />
                  <div className="h-2.5 w-8 bg-border rounded-sm mt-1.5" />
                </div>
              ))}
            </div>

            {/* Skeleton Active Day Timeline Card containing the Progress Loader */}
            <div className="bg-surface border border-border/70 rounded-lg p-6 md:p-8 shadow-md space-y-6 relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.005] to-teal/[0.005] pointer-events-none" />
              
              {/* Dynamic Checklist Loader integrated inside the Day Card */}
              <div className="relative w-32 h-16 flex items-center justify-center">
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
                  <motion.circle cx="10" cy="30" r="4" fill="var(--color-gold)" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <motion.circle cx="60" cy="30" r="4" fill="var(--color-teal)" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                  <motion.circle cx="110" cy="30" r="4" fill="var(--color-coral)" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
                </svg>
              </div>

              <span className="text-meta font-mono text-coral block mb-1 font-bold uppercase tracking-widest animate-pulse">
                Journey Companion
              </span>
              <h2 className="font-display text-2xl text-night font-light lowercase leading-none mb-4 max-w-sm">
                {loadingMsg}
              </h2>

              <div className="w-full max-w-xs space-y-3.5 text-left border-t border-border/40 pt-5 mt-2">
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
                          ? 'bg-gold border-gold text-night font-bold shadow-sm' 
                          : isCurrent 
                            ? 'bg-teal border-teal text-white shadow-sm' 
                            : 'border-border/60 bg-background text-transparent'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3] text-night" />
                        ) : isCurrent ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        ) : null}
                      </div>
                      <span className={`text-body transition-colors duration-300 ${
                        isDone ? 'text-muted/40 line-through font-light' : isCurrent ? 'text-night font-bold' : 'text-muted/20 font-light'
                      }`}>
                        {msg}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skeleton Map Section */}
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-border rounded-sm" />
              <div className="h-px flex-1 bg-border/20" />
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg h-44 w-full flex items-center justify-center">
              <div className="text-micro font-mono uppercase tracking-[0.2em] text-muted/30">Plotting Route Map...</div>
            </div>
          </div>
          
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
              
              <motion.div className="bg-white border border-border/70 rounded-lg shadow-lg p-6 max-w-sm w-full relative z-10 text-night text-left space-y-5"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}>
                
                <div className="flex items-center gap-3 border-b border-border/15 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-section text-night font-light lowercase leading-tight">Save this journey to your Passport</h3>
                    <p className="text-meta font-mono text-muted mt-0.5">Explorer Passport Sync</p>
                  </div>
                </div>
 
                <div className="space-y-2.5 py-1">
                  <p className="text-body text-muted/80 leading-relaxed font-light">
                    Your journey is already saved locally. Sign in to sync it across devices and unlock your explorer achievements.
                  </p>
                  <ul className="text-body space-y-2 text-night/85 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span>Access your Passport on any device</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                      <span>Never lose your saved journeys</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                      <span>Unlock explorer badges & seals</span>
                    </li>
                  </ul>
                </div>
 
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={handleContinueWithGoogle}
                    className="btn btn-night w-full h-11 rounded-md text-caption flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
                    className="btn btn-outline w-full h-11 rounded-md text-caption border-border/40 bg-white text-muted hover:text-night cursor-pointer"
                  >
                    Save Locally
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
              className="fixed bottom-5 right-5 z-[100] bg-night text-white px-5 py-3 rounded-md shadow-lg border border-white/10 flex items-center gap-2 font-mono text-meta uppercase"
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
        if (id === 'custom') return;
        const found = DURATION_OPTIONS.find(o => o.id === id);
        if (found) setCustomDuration(found.days);
      }}
      onCustomDurationChange={setCustomDuration}
      onBudgetChange={setCustomBudgetAmount}
      onNotesChange={setNotes}
      onStart={() => setHasStarted(true)}
      onNext={handleNext}
      onBack={handleBack}
      onGenerate={handleGenerate}
    />
  );
}