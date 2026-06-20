"use client";
import { useState, useEffect } from 'react';
import {
  Sparkles, ArrowLeft, ArrowRight, User, Users, Heart, DollarSign,
  Mountain, Waves, Utensils, BookOpen, Compass, MapPin, Calendar,
  CheckCircle2, Clock, Sun, Camera, Compass as ShipIcon, Shield, Sparkle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { saveItineraryAction } from '../../backend/actions/shareActions';
import { getAtmosphere } from '../utils/atmosphere';

// Dynamically import the Leaflet route map to prevent SSR issues
const ItineraryMap = dynamic(() => import('./map/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-52 rounded-2xl bg-cream animate-pulse flex items-center justify-center border border-warm-gray">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/60">Plotting Route Map...</span>
    </div>
  )
});

interface AiPlannerViewProps {
  onSaveItinerary?: (itin: any) => void;
  loadedItinerary?: any;
  onClearLoadedItinerary?: () => void;
}

const COMPANION_OPTIONS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Mindful solitude and slow reflection', icon: User },
  { id: 'couple', label: 'Couple Escape', desc: 'Designed for private memory-making', icon: Heart },
  { id: 'family', label: 'Family Journey', desc: 'Relaxed pacing suitable for everyone', icon: Users },
  { id: 'friends', label: 'Group Expedition', desc: 'Bespoke shared flow and discovery', icon: Users },
];

const BUDGET_OPTIONS = [
  { id: 'Small', label: 'Budget Explorer', desc: 'Authentic local stays and street eats', icon: DollarSign },
  { id: 'Medium', label: 'Curated Comfort', desc: 'Bespoke boutique hotels and curated dining', icon: Compass },
  { id: 'Luxury', label: 'Royal Heritage', desc: 'Heritage palace stays and private transport', icon: Sparkles },
];

const STYLE_OPTIONS = [
  { id: 'Spiritual', label: 'Spiritual', desc: 'Ghats, temples, and quiet morning rituals', icon: Compass },
  { id: 'Adventure', label: 'Adventure', desc: 'Himalayan ridges and high-altitude trails', icon: Mountain },
  { id: 'Nature', desc: 'Scenic backwaters and organic spice forests', label: 'Nature', icon: Waves },
  { id: 'Culture', label: 'Culture', desc: 'Ancestral crafts and living monument tours', icon: BookOpen },
  { id: 'Food', label: 'Food', desc: 'Traditional culinary thalis and spice markets', icon: Utensils },
  { id: 'Luxury', label: 'Luxury', desc: 'Refined retreat villas and floating oases', icon: Sparkles },
];

const ENERGY_OPTIONS = [
  { id: 'peaceful', label: 'Slow & Peaceful', desc: 'Highly relaxed, deep immersion, few stops' },
  { id: 'deep_cultural', label: 'Deep Cultural', desc: 'Focus on history, local guilds, and rituals' },
  { id: 'adventure_packed', label: 'Adventure Packed', desc: 'Active crossings, bouldering, and boat treks' },
  { id: 'photography', label: 'Photography Focused', desc: 'Sunrise vantage spots and golden hour guides' },
  { id: 'food_focused', label: 'Food Focused', desc: 'Local bazaars, cooking steps, and estate tea' },
  { id: 'luxury_escape', label: 'Luxury Escape', desc: 'Bespoke cruisers, private guides, and spas' },
];

const DURATION_OPTIONS = [
  { id: 'weekend', label: 'Weekend Reset', desc: '2 - 3 Days', days: 3 },
  { id: 'short', label: '4 - 6 Days', desc: 'Mid-week escape', days: 5 },
  { id: 'week', label: 'One Week', desc: '7 Days exploration', days: 7 },
  { id: 'extended', label: 'Two Weeks', desc: '14 Days grand journey', days: 14 },
];

const LOADING_MESSAGES = [
  "Consulting regional archives...",
  "Mapping coordinates and route paths...",
  "Formatting localized experiences in ₹ INR...",
  "Finalizing your Indian companion journal...",
];

export default function AiPlannerView({
  onSaveItinerary,
  loadedItinerary,
  onClearLoadedItinerary
}: AiPlannerViewProps) {
  const [step, setStep] = useState(1);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [itineraryResult, setItineraryResult] = useState<any>(null);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Form selections
  const [travelers, setTravelers] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(5);
  const [notes, setNotes] = useState("");

  const totalSteps = 5;

  // Handle incoming pre-loaded itinerary (from Passport)
  useEffect(() => {
    if (loadedItinerary) {
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
      setBudget(loadedItinerary.budget >= 5000 ? 'Luxury' : loadedItinerary.budget >= 1500 ? 'Medium' : 'Small');
      setDuration(loadedItinerary.duration <= 3 ? 'weekend' : loadedItinerary.duration <= 7 ? 'week' : 'extended');
      setTravelers('solo');
      setMood('Relaxation');
      setSavedId(loadedItinerary.id);
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

  const canProceed = () => {
    switch (step) {
      case 1: return travelers !== null;
      case 2: return budget !== null;
      case 3: return mood !== null;
      case 4: return energy !== null;
      case 5: return duration !== null;
      default: return false;
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

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guests: travelers === 'solo' ? 1 : travelers === 'couple' ? 2 : travelers === 'family' ? 4 : 6,
          companion: travelers || 'solo',
          budget,
          travelStyle: mood,
          fromDate: new Date().toISOString(),
          toDate: new Date(Date.now() + customDuration * 24 * 60 * 60 * 1000).toISOString(),
          travelPace: 'Moderate',
          interests: energy || '',
          experience: '',
        })
      });

      const data = await res.json();
      clearInterval(msgInterval);
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Failed to generate");

      // Optional telemetry post
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'planner',
          payload: { destination: data.destinationId || 'unknown', budget, duration: customDuration, travelStyle: mood }
        })
      }).catch(() => {});

      setItineraryResult(data);
    } catch (err: any) {
      clearInterval(msgInterval);
      setLoading(false);
      console.error("AI Generation failed:", err);
      setItineraryResult({ error: err.message });
    }
  };

  const handleSave = async () => {
    if (!itineraryResult || itineraryResult.error) return;
    setSaving(true);
    try {
      const result = await saveItineraryAction({
        title: `Journal: Escape to ${itineraryResult.destinationId || 'Unknown'}`,
        destination: itineraryResult.destinationId || 'Unknown',
        budget: budget === 'Luxury' ? 5000 : budget === 'Medium' ? 1500 : 500,
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
            title: `Journal: Escape to ${itineraryResult.destinationId || 'Unknown'}`,
            destination: itineraryResult.destinationId || 'Unknown',
            budget: budget === 'Luxury' ? 5000 : budget === 'Medium' ? 1500 : 500,
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
            destinationName: itineraryResult.destinationId,
          });
        }
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setTravelers(null);
    setBudget(null);
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
    const compLabel = travelers === 'solo' ? 'Nomad' : travelers === 'couple' ? 'Romantic' : travelers === 'family' ? 'Patriarch' : 'Syndicate';
    let moodLabel = 'Explorer';
    if (mood === 'Adventure') moodLabel = 'Seeker';
    else if (mood === 'Relaxation') moodLabel = 'Restorer';
    else if (mood === 'Luxury') moodLabel = 'Connoisseur';
    else if (mood === 'Food') moodLabel = 'Epicurean';
    else if (mood === 'Culture') moodLabel = 'Philosopher';
    return `${compLabel} ${moodLabel}`;
  };

  // ── MOCK LOADING PHASE ──
  if (loading) {
    return (
      <div className="pt-28 pb-32 px-6 max-w-lg mx-auto min-h-screen bg-sand flex flex-col items-center justify-center text-center">
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-warm-gray border-t-saffron animate-spin" />
          <Compass className="w-8 h-8 text-gold animate-pulse" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-saffron block mb-2 font-bold">
          Generating Journey
        </span>
        <h2 className="font-display text-3xl font-light text-night lowercase leading-none mb-3">
          {loadingMsg}
        </h2>
        <div className="w-full bg-cream h-1 rounded-full overflow-hidden max-w-[200px]">
          <div 
            className="bg-saffron h-full transition-all duration-700 ease-out" 
            style={{ width: `${((loadingStepIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ── JOURNEY RESULTS DISPLAY ──
  if (itineraryResult) {
    if (itineraryResult.error) {
      return (
        <div className="pt-28 pb-32 px-6 max-w-md mx-auto min-h-screen bg-sand flex items-center justify-center">
          <div className="text-center p-8 bg-white border border-warm-gray rounded-3xl shadow-sm space-y-4">
            <Compass className="w-10 h-10 text-muted/30 mx-auto" />
            <h2 className="font-display text-2xl font-light text-night lowercase">Connection Failed</h2>
            <p className="text-xs text-muted/60 font-light leading-relaxed">{itineraryResult.error}</p>
            <button 
              onClick={handleReset} 
              className="px-6 py-2.5 rounded-xl bg-night text-white text-xs font-bold uppercase tracking-wider hover:bg-saffron transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    const itin = itineraryResult.itinerary || [];
    const costs = itineraryResult.costs || { transit: 0, stay: 0, food: 0, total: 0 };
    const weather = itineraryResult.weather || { temperature: 'N/A', conditions: 'Clear' };
    const currentDay = itin[activeDayTab] || {};
    const atmo = getAtmosphere(itineraryResult.destinationId || "");

    return (
      <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen bg-sand select-none text-left">
        
        {/* Results Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-warm-gray pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-saffron font-bold">journey logs</span>
              <span className="h-px w-8 bg-cream" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted/60 font-bold">{getJourneyPersona()}</span>
            </div>
            <h1 className="font-display text-4.5xl text-night font-light lowercase leading-none">
              chapter results
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!savedId ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-night text-white text-[10px] font-bold uppercase tracking-wider hover:bg-saffron transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save to Passport'}
              </button>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-[#004D40]/10 text-[#004D40] text-[10px] font-bold uppercase tracking-wider border border-[#004D40]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Archived in Passport
              </span>
            )}
            <button 
              onClick={handleReset} 
              className="px-5 py-3 rounded-xl border border-warm-gray bg-white text-[10px] font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-sand transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Dynamic two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Summary & Budget (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-warm-gray rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted/40 block leading-none mb-1">
                    destination chapter
                  </span>
                  <h2 className="font-display text-3xl font-light text-night lowercase leading-none">
                    {itineraryResult.destinationId ? itineraryResult.destinationId.split('-')[0] : 'Curated Destination'}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-saffron/10 text-saffron text-[8px] font-bold uppercase tracking-wider border border-saffron/20">
                  {itineraryResult.recommendationScore || 96}% Match
                </span>
              </div>

              <p className="text-xs text-muted leading-relaxed font-light font-sans">
                {itineraryResult.recommendationReasoning || `A personalized ${customDuration}-day itinerary crafted to highlight signature sights, local secrets, and traditional culinary stops.`}
              </p>

              {/* Itinerary Map */}
              <div className="h-56 rounded-2xl overflow-hidden border border-warm-gray">
                <ItineraryMap days={itin} activeDay={activeDayTab} />
              </div>

              {/* Budget Breakdown (INR only) */}
              <div className="space-y-3 pt-3 border-t border-warm-gray">
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 block mb-1 font-bold">
                  estimated budget (₹ INR)
                </h4>
                
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-muted">
                    <span className="font-light">Regional Transit & Drivers</span>
                    <span className="font-bold">₹{costs.transit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span className="font-light">Boutique Accommodations</span>
                    <span className="font-bold">₹{costs.stay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span className="font-light">Food, Passes & Guides</span>
                    <span className="font-bold">₹{costs.food.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px bg-cream my-1" />
                  <div className="flex justify-between text-sm font-bold text-night pt-1">
                    <span>Total Estimate</span>
                    <span>₹{costs.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Day-by-day Logs & Extras (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Day Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {itin.map((dayItem: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayTab(idx)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                    activeDayTab === idx
                      ? 'bg-night text-white border-night shadow-sm'
                      : 'bg-white text-muted/70 border-warm-gray hover:border-gold'
                  }`}
                >
                  Day {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Day Logs */}
            <div className="bg-white border border-warm-gray rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-saffron block leading-none mb-1 font-bold">
                  Day {activeDayTab + 1} Logs
                </span>
                <h3 className="font-display text-2.5xl font-light text-night lowercase leading-tight">
                  {currentDay.title}
                </h3>
              </div>

              <p className="text-xs text-muted leading-relaxed font-light">
                {currentDay.description}
              </p>

              {/* Scheduled Stops */}
              <div className="space-y-3 pt-3 border-t border-warm-gray">
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 block font-bold">
                  scheduled stops
                </h4>
                <div className="space-y-3">
                  {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => {
                    const times = ["Morning", "Afternoon", "Evening"];
                    const timeLabel = times[aIdx] || "Scheduled stop";
                    return (
                      <div key={aIdx} className="flex gap-4 items-start text-xs">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-saffron font-bold shrink-0 pt-0.5 w-18">
                          {timeLabel}
                        </div>
                        <div className="flex-1 text-muted font-light leading-relaxed">
                          {act}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Local Extras block */}
            <div className="bg-warm-white border border-warm-gray rounded-3xl p-6 space-y-5">
              <h3 className="font-display text-2.5xl font-light text-night lowercase leading-none">
                local insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                
                {/* Weather */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">seasonal weather</span>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-gold" />
                    <span className="font-bold text-night">{weather.temperature} · {weather.conditions}</span>
                  </div>
                </div>

                {/* Nearby exploration */}
                {itineraryResult.nearbyPlaces && itineraryResult.nearbyPlaces.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">nearby points</span>
                    <span className="font-bold text-night truncate block">{itineraryResult.nearbyPlaces[0].name} ({itineraryResult.nearbyPlaces[0].distance})</span>
                  </div>
                )}

                {/* Local cuisine */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">local cuisine</span>
                  <span className="font-bold text-night">Street food walks · Thali experiences · Regional specialties</span>
                </div>

                {/* Transport */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">recommended transport</span>
                  <span className="font-bold text-night">Private car with driver · Local auto-rickshaw · Shared taxis</span>
                </div>

                {/* Photography */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">photography spots</span>
                  <span className="font-bold text-night">Sunrise vantage · Heritage architecture · Local market life · Natural landscapes</span>
                </div>

                {/* Packing */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block font-bold">packing tips</span>
                  <span className="font-bold text-night">Light layers · Comfortable walking shoes · Sun protection · Power bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 5-STEP QUESTIONNAIRE WIZARD ──
  return (
    <div className="pt-24 pb-32 px-6 max-w-3xl mx-auto min-h-screen bg-sand flex flex-col justify-center select-none text-left">
      
      {/* Wizard Progress Header */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron font-bold">
            Journey Wizard
          </span>
          <span className="font-mono text-[10px] text-muted/60 uppercase tracking-widest font-bold">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-cream h-1 rounded-full overflow-hidden">
          <div 
            className="bg-saffron h-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* ── STEP 1: COMPANION ── */}
      {step === 1 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              who is <span className="font-display italic text-gold">traveling</span>?
            </h2>
            <p className="text-xs text-muted/60 font-light">Select the companionship structure for this voyage.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPANION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = travelers === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setTravelers(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-4 items-center ${
                    isSelected 
                      ? 'bg-white border-saffron shadow-sm' 
                      : 'bg-warm-white border-warm-gray hover:border-gold hover:bg-white/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-saffron/10 text-saffron' : 'bg-cream/40 text-muted/50'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-1">
                      {opt.label}
                    </h3>
                    <p className="text-[10px] text-muted/60 font-light font-sans leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 2: BUDGET ── */}
      {step === 2 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              select your <span className="font-display italic text-gold">budget tier</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Choose your preferred lodging and comfort baseline.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = budget === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setBudget(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 text-left ${
                    isSelected 
                      ? 'bg-white border-saffron shadow-sm' 
                      : 'bg-warm-white border-warm-gray hover:border-gold hover:bg-white/40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-saffron/10 text-saffron' : 'bg-cream/40 text-muted/50'
                  }`}>
                    <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-1.5">
                      {opt.label}
                    </h3>
                    <p className="text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 3: STYLE ── */}
      {step === 3 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              your travel <span className="font-display italic text-gold">style</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Determine the primary focus of your discovery.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STYLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = mood === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setMood(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-4 items-center ${
                    isSelected 
                      ? 'bg-white border-saffron shadow-sm' 
                      : 'bg-warm-white border-warm-gray hover:border-gold hover:bg-white/40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-saffron/10 text-saffron' : 'bg-cream/40 text-muted/50'
                  }`}>
                    <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-0.5">
                      {opt.label}
                    </h3>
                    <p className="text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 4: TRIP ENERGY ── */}
      {step === 4 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              journey <span className="font-display italic text-gold">energy</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Select the velocity and flavor of exploration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ENERGY_OPTIONS.map((opt) => {
              const isSelected = energy === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setEnergy(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left ${
                    isSelected 
                      ? 'bg-white border-saffron shadow-sm' 
                      : 'bg-warm-white border-warm-gray hover:border-gold hover:bg-white/40'
                  }`}
                >
                  <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-0.5">
                    {opt.label}
                  </h3>
                  <p className="text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 5: DURATION ── */}
      {step === 5 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              duration of <span className="font-display italic text-gold">stay</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Choose the length of your travel cycle.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = duration === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleDurationSelect(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left ${
                    isSelected 
                      ? 'bg-white border-saffron shadow-sm' 
                      : 'bg-warm-white border-warm-gray hover:border-gold hover:bg-white/40'
                  }`}
                >
                  <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-0.5">
                    {opt.label}
                  </h3>
                  <p className="text-[10px] text-muted/60 font-light">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Bottom Controls */}
      <div className="mt-12 flex justify-between items-center">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl border border-warm-gray bg-white text-[10px] font-bold uppercase tracking-wider text-muted hover:text-night transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-night hover:bg-saffron disabled:bg-cream/60 disabled:text-muted/40 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
        >
          {step === totalSteps ? (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Journey
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
