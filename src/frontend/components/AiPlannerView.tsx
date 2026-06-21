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
import { TOURS_DATA } from '../data';

// Dynamically import the Leaflet route map to prevent SSR issues
const ItineraryMap = dynamic(() => import('./map/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-52 rounded-2xl bg-cream animate-pulse flex items-center justify-center border border-warm-gray">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/60">Plotting Route Map...</span>
    </div>
  )
});

import { Tour } from '../types';
import { getHotelsByDestination } from '../data/hotels';
import HotelCard from './HotelCard';

interface AiPlannerViewProps {
  onSaveItinerary?: (itin: any) => void;
  loadedItinerary?: any;
  onClearLoadedItinerary?: () => void;
  allTours?: Tour[];
}

function WaxSeal({ text = "TRIPZY APPROVED", subtext = "ATLAS VIVANT" }) {
  return (
    <div className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 select-none pointer-events-none z-30 animate-stamp-slam drop-shadow-md" style={{ '--stamp-rotation': '-6deg' } as any}>
      {/* Wax outer ring */}
      <div className="absolute inset-0 rounded-full bg-[#C1573A] border border-[#a0452d] opacity-95 shadow-inner flex items-center justify-center animate-pulse-slow" style={{ transform: 'scale(1.04) rotate(-2deg)' }}>
        {/* Inner circle with embossed stamp text */}
        <div className="w-[84%] h-[84%] rounded-full border-2 border-dashed border-white/25 flex flex-col items-center justify-center bg-[#a0452d]/10 text-white text-center font-display relative">
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/10 scale-95" />
          <span className="text-[5px] font-mono font-bold uppercase tracking-widest leading-none block mb-0.5 text-white/90">tripzy ai</span>
          <span className="text-[7.5px] font-bold uppercase tracking-wide leading-none font-sans block text-white/95">{text}</span>
          <span className="text-[5px] font-mono uppercase tracking-[0.2em] leading-none block mt-1 text-white/60">{subtext}</span>
        </div>
      </div>
    </div>
  );
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
  { id: 'adventure_packed', label: 'High Intensity', desc: 'Active crossings, bouldering, and boat treks' },
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

const DEST_CUISINE: Record<string, string> = {
  'varanasi-spiritual': 'Kachori sabzi · Banarasi paan · Malaiyyo · Thandai · Street side chai',
  'jaisalmer-fort': 'Dal baati churma · Ker sangri · Gatte ki sabzi · Bajra roti · Desert thali',
  'kerala-houseboats': 'Kerala sadya · Appam with stew · Karimeen pollichathu · Puttu & kadala',
  'ladakh-passes': 'Thukpa · Momos · Skyu · Butter tea · Apricot jam & Tibetan bread',
  'kashmir-meadows': 'Wazwan feast · Rogan josh · Yakhni · Kashmiri pulao · Kahwa tea',
  'udaipur-mewar': 'Dal baati churma · Laal maas · Gatte · Mawa kachori · Rajasthani thali',
  'munnar-tea': 'Kerala sadya · Appam with vegetable stew · Fresh tea · Banana chips',
  'goa-beach': 'Fish curry rice · Prawn balchão · Bebinca · Pork vindaloo · Feni',
  'hampi-ruins': 'South Indian thali · Bisi bele bath · Filter coffee · Holige',
  'kutch-salt': 'Kutchi dabeli · Bajra roti · Kadhi · Khaman · Chaas',
  'cherrapunji-roots': 'Jadoh · Doh neiiong · Tungrymbai · Pukhlein · Rice beer',
  'andaman-reefs': 'Fresh seafood · Coconut prawn curry · Grilled lobster · Banana fritters',
};

const DEST_TRANSPORT: Record<string, string> = {
  'varanasi-spiritual': 'Cycle rickshaw · Auto-rickshaw · Boat ghat crossing · Walking the narrow lanes',
  'jaisalmer-fort': 'Camel safari · Jeep safari · Auto-rickshaw · Private taxi from Jaisalmer station',
  'kerala-houseboats': 'Houseboat · Local ferry · Autorickshaw · Private cab with driver',
  'ladakh-passes': 'SUV/taxi hire · Shared jeep · Mountain bike · Local bus (limited)',
  'kashmir-meadows': 'Shikara on Dal Lake · Gondola at Gulmarg · Private taxi · Local bus',
  'udaipur-mewar': 'Boat on Lake Pichola · Auto-rickshaw · Cycle rickshaw · Palace on wheels',
  'munnar-tea': 'Private taxi · Local bus · Jeep safari to tea estates · Walking trails',
  'goa-beach': 'Scooter/bike rental · Taxi · Local bus · Ferry to islands',
  'hampi-ruins': 'Auto-rickshaw · Cycle rickshaw · Bicycle · Coracle boat on river',
  'kutch-salt': '4x4 jeep · Private taxi · Bus to Bhuj · Camel cart in villages',
  'cherrapunji-roots': 'Private taxi · Local sumo · Walking trails through villages',
  'andaman-reefs': 'Ferry to islands · Scooter at Havelock · Private cab · Boat taxi',
};

const DEST_PHOTO: Record<string, string> = {
  'varanasi-spiritual': 'Dashashwamedh Ghat at dawn · Narrow lanes of old city · Ganga Aarti flames · Silk looms',
  'jaisalmer-fort': 'Golden Fort at sunset · Sam Sand Dunes · Haveli carvings · Desert night sky',
  'kerala-houseboats': 'Backwaters at golden hour · Tea gardens in Munnar · Chinese fishing nets · Kathakali performer',
  'ladakh-passes': 'Pangong Lake blues · Khardung La pass · Hemis Monastery · Starry sky at Nubra',
  'kashmir-meadows': 'Dal Lake sunrise · Mughal gardens · Gulmarg meadows · Saffron fields in bloom',
  'udaipur-mewar': 'Lake Pichola sunset · City Palace from water · Jag Mandir · Haveli architecture',
  'munnar-tea': 'Tea plantation rows · Nilgiri Tahr at Eravikulam · Misty hills · Waterfalls',
  'goa-beach': 'Anjuna sunset · Portuguese colonial architecture · Dudhsagar Falls · Spice garden flora',
  'hampi-ruins': 'Stone chariot at sunrise · Matanga Hill panorama · Vijaya Vittala temple · Boulders at Tungabhadra',
  'kutch-salt': 'White Rann at sunset · Kala Dungar view · Mirror work textiles · Desert wildlife',
  'cherrapunji-roots': 'Living root bridges · Nohkalikai Falls · Dawki River · Seven Sisters Falls',
  'andaman-reefs': 'Radhanagar Beach sunset · Coral reefs underwater · Cellular Jail · Mangrove creeks',
};

const DEST_PACKING: Record<string, string> = {
  'varanasi-spiritual': 'Light cotton clothes · Walking shoes · Shawl for morning boat ride · Power bank · Reusable water bottle',
  'jaisalmer-fort': 'Light layers · Scarf for dust · Sunscreen · Sunglasses · Comfortable walking sandals · Power bank',
  'kerala-houseboats': 'Light cottons · Rain jacket (monsoon) · Insect repellent · Sun hat · Sarong for temples',
  'ladakh-passes': 'Thermal layers · Windproof jacket · Sunglasses · Lip balm · Sunscreen · Altitude sickness meds',
  'kashmir-meadows': 'Warm jacket · Waterproof shoes · Merino wool layers · Gloves in winter · Sunglasses',
  'udaipur-mewar': 'Light cottons · Scarf for temple visits · Sun hat · Camera · Comfortable walking shoes',
  'munnar-tea': 'Light layers · Rain jacket · Walking shoes · Insect repellent · Reusable water bottle',
  'goa-beach': 'Swimwear · Light cottons · Flip-flops · Sunscreen · Sunglasses · Beach bag',
  'hampi-ruins': 'Walking shoes · Sun hat · Sunscreen · Light layers · Water bottle · Comfy backpack',
  'kutch-salt': 'Light layers · Sun protection · Dust mask · Sunglasses · Scarf · Power bank',
  'cherrapunji-roots': 'Rain jacket · Waterproof shoes · Quick-dry clothes · Insect repellent · Torch/headlamp',
  'andaman-reefs': 'Swimwear · Snorkel gear (optional) · Reef-safe sunscreen · Light cottons · Flip-flops · Insect repellent',
};

export default function AiPlannerView({
  onSaveItinerary,
  loadedItinerary,
  onClearLoadedItinerary,
  allTours = []
}: AiPlannerViewProps) {
  const [step, setStep] = useState(1);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [itineraryResult, setItineraryResult] = useState<any>(null);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [fromLocation, setFromLocation] = useState('');

  const [customBudgetAmount, setCustomBudgetAmount] = useState(10000);

  const getDestinationPrettyName = (destId: string | null | undefined): string => {
    if (!destId) return 'Curated Destination';
    
    // 1. Try finding in dynamic loaded tours
    if (allTours && allTours.length > 0) {
      const tourObj = allTours.find(t => t.id === destId || t.dbId === destId);
      if (tourObj) return tourObj.title;
    }
    
    // 2. Try static data
    const staticTour = TOURS_DATA.find(t => t.id === destId || t.dbId === destId);
    if (staticTour) return staticTour.title;
    
    // 3. Fallback: slug
    if (destId.includes('-')) {
      const part = destId.split('-')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    
    return destId;
  };

  const getWashiTapeClass = (tourId: string | null | undefined): string => {
    if (!tourId) return 'washi-tape-saffron';
    const lower = tourId.toLowerCase();
    if (lower.includes('kerala') || lower.includes('munnar') || lower.includes('goa') || lower.includes('andaman')) {
      return 'washi-tape-ocean';
    }
    if (lower.includes('ladakh') || lower.includes('kashmir') || lower.includes('cherrapunji')) {
      return 'washi-tape-sage';
    }
    return 'washi-tape-saffron';
  };

  // Form selections
  const [travelers, setTravelers] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(5);
  const [notes, setNotes] = useState("");

  const totalSteps = 6;

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

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDestination !== null;
      case 2: return travelers !== null;
      case 3: return budget !== null;
      case 4: return mood !== null;
      case 5: return energy !== null;
      case 6: return duration !== null;
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

    let timeoutId: ReturnType<typeof setTimeout>;
    try {
      const destName = selectedDestination ? (TOURS_DATA.find(t => t.id === selectedDestination)?.title || selectedDestination) : 'Unknown';
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/plan-trip', {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          fromLocation: fromLocation || undefined,
          guests: travelers === 'solo' ? 1 : travelers === 'couple' ? 2 : travelers === 'family' ? 4 : 6,
          companion: travelers || 'solo',
          budget,
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
      clearTimeout(timeoutId);
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
      const destId = itineraryResult.destinationId || selectedDestination || '';
      const destPrettyName = getDestinationPrettyName(destId);
      const result = await saveItineraryAction({
        title: `Journal: Escape to ${destPrettyName}`,
        destination: destId,
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
            title: `Journal: Escape to ${destPrettyName}`,
            destination: destId,
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
    setSelectedDestination(null);
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
    const compLabel = travelers === 'solo' ? 'Nomad' : travelers === 'couple' ? 'Romantic' : travelers === 'family' ? 'Family Oriented' : 'Group Explorers';
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
            <h2 className="font-display text-2xl font-light text-night lowercase">Journey Interrupted</h2>
            <p className="text-xs text-muted/60 font-light leading-relaxed">{itineraryResult.error}</p>
            <button 
              onClick={handleGenerate} 
              className="px-6 py-2.5 rounded-xl bg-night text-white text-xs font-bold uppercase tracking-wider hover:bg-saffron transition-colors cursor-pointer"
            >
              Retry
            </button>
            <button 
              onClick={handleReset} 
              className="px-6 py-2.5 rounded-xl border border-warm-gray bg-white text-xs font-bold uppercase tracking-wider text-muted hover:text-night transition-colors cursor-pointer"
            >
              Start Over
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
    const destId = itineraryResult.destinationId || selectedDestination || '';
    const tour = TOURS_DATA.find(t => t.id === destId);

    return (
      <div className="pt-10 pb-32 px-6 max-w-7xl mx-auto min-h-screen bg-sand select-none text-left">
        
        {/* Results Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-warm-gray pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-saffron font-bold">journey plan</span>
              <span className="h-px w-8 bg-cream" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted/60 font-bold">{getJourneyPersona()}</span>
            </div>
            <h1 className="font-display text-4.5xl text-night font-light lowercase leading-none">
              your {getDestinationPrettyName(destId).toLowerCase()} itinerary
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

        {/* ── PREMIUM JOURNEY SUMMARY ── */}
        <div className="mb-10 bg-white border border-warm-gray rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-saffron font-bold">journey summary</span>
            <span className="h-px flex-1 bg-cream" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-warm-white rounded-2xl p-3.5 border border-warm-gray/60 text-center">
              <span className="font-display text-2xl font-light text-saffron leading-none block">{itineraryResult.recommendationScore || 96}%</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mt-1">match score</span>
            </div>
            <div className="bg-warm-white rounded-2xl p-3.5 border border-warm-gray/60 text-center">
              <span className="font-display text-2xl font-light text-night leading-none block">₹{costs.total.toLocaleString('en-IN')}</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mt-1">estimated total</span>
            </div>
            <div className="bg-warm-white rounded-2xl p-3.5 border border-warm-gray/60 text-center">
              <span className="font-display text-2xl font-light text-gold leading-none block">{tour?.bestSeason || weather.conditions || 'Oct–Mar'}</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mt-1">best season</span>
            </div>
            <div className="bg-warm-white rounded-2xl p-3.5 border border-warm-gray/60 text-center">
              <span className="font-display text-2xl font-light text-night leading-none block">{customDuration} days</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mt-1">duration</span>
            </div>
            <div className="bg-warm-white rounded-2xl p-3.5 border border-warm-gray/60 text-center col-span-2 sm:col-span-1">
              <span className="font-display text-2xl font-light text-night leading-none block lowercase truncate">
                {getDestinationPrettyName(destId).toLowerCase()}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mt-1">route</span>
            </div>
          </div>
          {itineraryResult.recommendationReasoning && (
            <p className="text-xs text-muted/60 font-light leading-relaxed mt-4 pt-3 border-t border-warm-gray/50 pr-24">
              {itineraryResult.recommendationReasoning}
            </p>
          )}

          {/* Wax seal of approval placed dynamically in the summary card */}
          <WaxSeal text="TRIPZY APPROVED" subtext="ATLAS VIVANT" />
        </div>

        {/* Dynamic two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Summary & Map (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-warm-gray rounded-3xl p-6 shadow-sm space-y-5 relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted/40 block leading-none mb-1">
                    destination
                  </span>
                  <h2 className="font-display text-3xl font-light text-night lowercase leading-none">
                    {getDestinationPrettyName(destId)}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-saffron/10 text-saffron text-[8px] font-bold uppercase tracking-wider border border-saffron/20">
                  {itineraryResult.recommendationScore || 96}% Match
                </span>
              </div>

              <p className="text-xs text-muted leading-relaxed font-light font-sans">
                A custom-calibrated itinerary reflecting your style, companion preferences, and budget tier. Crafted using local archive insights.
              </p>

              {/* Itinerary Map */}
              <div className="h-56 rounded-2xl overflow-hidden border border-warm-gray">
                <ItineraryMap days={itin} activeDay={activeDayTab} />
              </div>
            </div>

            {/* Premium Boarding Pass Cost Summary Card */}
            <div className="bg-[#FAF8F4] border border-warm-gray/60 rounded-3xl p-6 relative overflow-hidden shadow-card">
              {/* Ticket stub punch holes */}
              <div className="absolute top-[55%] -left-3.5 w-7 h-7 bg-sand rounded-full border-r border-warm-gray/60 z-10" />
              <div className="absolute top-[55%] -right-3.5 w-7 h-7 bg-sand rounded-full border-l border-warm-gray/60 z-10" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-saffron font-bold">boarding pass / cost summary</span>
                <span className="text-[8px] font-mono text-muted/40 uppercase tracking-widest">cls. explorer · gate 1a</span>
              </div>
              
              <div className="space-y-3.5 text-xs font-sans border-b border-dashed border-warm-gray/60 pb-5">
                <div className="flex justify-between text-muted">
                  <span className="font-light">Transit & transfers</span>
                  <span className="font-semibold text-night">₹{costs.transit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span className="font-light">Accommodations</span>
                  <span className="font-semibold text-night">₹{costs.stay.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span className="font-light">Food & local experiences</span>
                  <span className="font-semibold text-night">₹{costs.food.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="pt-5 flex justify-between items-center relative">
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-0.5">estimated total</span>
                  <span className="text-3xl font-display font-light text-night leading-none">₹{costs.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-1">itinerary tier</span>
                  <span className="px-3 py-1 rounded bg-gold/15 text-gold text-[9px] font-bold uppercase tracking-wider border border-gold/30">
                    {budget === 'Luxury' ? 'Heritage' : budget === 'Medium' ? 'Curated' : 'Bespoke'}
                  </span>
                </div>
              </div>
              
              {/* Ticket Barcode representation */}
              <div className="barcode-lines h-10 w-full mt-5 rounded opacity-[0.22]" />
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
                      ? 'bg-night text-white border-night shadow-sm scale-102'
                      : 'bg-white text-muted/70 border-warm-gray hover:border-gold'
                  }`}
                >
                  Day {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Day Logs Card (Scrapbook Washi Taped) */}
            <div className="bg-white border border-warm-gray rounded-3xl p-6 pt-10 shadow-sm space-y-5 relative animate-fade-in">
              {/* Saffron Washi Tape Accent */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 ${getWashiTapeClass(destId)} rotate-[-1.5deg] z-10 flex items-center justify-center font-mono text-[7.5px] uppercase tracking-[0.25em] font-bold`}>
                day {activeDayTab + 1} details
              </div>

              <div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-saffron block leading-none mb-1 font-bold">
                  Day {activeDayTab + 1} Log
                </span>
                <h3 className="font-display text-2.5xl font-light text-night lowercase leading-tight">
                  {currentDay.title}
                </h3>
              </div>

              <p className="text-xs text-muted leading-relaxed font-light font-sans">
                {currentDay.description}
              </p>

              {/* Scheduled Stops */}
              <div className="space-y-3.5 pt-4 border-t border-warm-gray/60">
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 block font-bold">
                  daily schedule
                </h4>
                <div className="space-y-3.5">
                  {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => {
                    const times = ["Morning", "Afternoon", "Evening"];
                    const timeLabel = times[aIdx] || "Scheduled stop";
                    return (
                      <div key={aIdx} className="flex gap-4 items-start text-xs">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-saffron font-bold shrink-0 pt-0.5 w-18">
                          {timeLabel}
                        </div>
                        <div className="flex-1 text-muted font-light leading-relaxed font-sans">
                          {act}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Local Insights scrapbook card */}
            <div className="bg-[#FAF8F4] border border-warm-gray/60 rounded-3xl p-6 pt-10 space-y-6 relative shadow-sm">
              {/* Sage Washi Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-sage rotate-[1.5deg] z-10 flex items-center justify-center font-mono text-[7.5px] text-sage uppercase tracking-[0.25em] font-bold">
                field notes
              </div>

              <h3 className="font-display text-2.5xl font-light text-night lowercase leading-none mb-2">
                local insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Weather */}
                <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[-0.5deg]">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-saffron block font-bold mb-1">weather</span>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-gold" />
                    <span className="font-bold text-night">{weather.temperature} · {weather.conditions}</span>
                  </div>
                </div>

                {/* Nearby exploration */}
                {itineraryResult.nearbyPlaces && itineraryResult.nearbyPlaces.length > 0 && (
                  <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.5deg]">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-gold block font-bold mb-1">nearby explorations</span>
                    <span className="font-bold text-night truncate block">{itineraryResult.nearbyPlaces[0].name} ({itineraryResult.nearbyPlaces[0].distance})</span>
                  </div>
                )}

                {/* Local cuisine */}
                <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.8deg]">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-sage block font-bold mb-1.5">local cuisine</span>
                  <span className="font-bold text-night block leading-relaxed">{DEST_CUISINE[destId] || 'Street food walks · Thali experiences · Regional specialties'}</span>
                </div>

                {/* Transport */}
                <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[-1deg]">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-ocean block font-bold mb-1.5">getting around</span>
                  <span className="font-bold text-night block leading-relaxed">{DEST_TRANSPORT[destId] || 'Private car with driver · Local auto-rickshaw · Shared taxis'}</span>
                </div>

                {/* Photography */}
                <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[-0.6deg]">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-saffron block font-bold mb-1.5">photo spots</span>
                  <span className="font-bold text-night block leading-relaxed">{DEST_PHOTO[destId] || 'Sunrise vantage · Heritage architecture · Local market life · Natural landscapes'}</span>
                </div>

                {/* Packing */}
                <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.5deg]">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-sage block font-bold mb-1.5">packing tips</span>
                  <span className="font-bold text-night block leading-relaxed">{DEST_PACKING[destId] || 'Light layers · Comfortable walking shoes · Sun protection · Power bank'}</span>
                </div>
              </div>

              {/* Handwritten signature traveler note */}
              <div className="pt-2 text-center border-t border-warm-gray/40">
                <p className="text-muted/60 text-lg rotate-[-1deg]" style={{ fontFamily: "'La Belle Aurore', cursive" }}>
                  "live from the field: always keep local cash for auto-rickshaws!"
                </p>
              </div>
            </div>

            {/* ── HOTELS ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gold rounded-full" />
                <h3 className="font-display text-xl text-night font-bold">Where to Stay</h3>
              </div>
              <div className="space-y-3">
                {itineraryResult.destinationId && getHotelsByDestination(itineraryResult.destinationId).length > 0 ? (
                  getHotelsByDestination(itineraryResult.destinationId).slice(0, 4).map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                ) : itineraryResult.destinationDbId && getHotelsByDestination(itineraryResult.destinationDbId).length > 0 ? (
                  getHotelsByDestination(itineraryResult.destinationDbId).slice(0, 4).map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                ) : (
                  <div className="p-6 rounded-2xl bg-white border border-warm-gray text-center">
                    <p className="text-xs text-muted font-light">Hotels for this destination are being curated. Check back soon.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Derive preview persona label
  const previewPersona = travelers && mood
    ? `${travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : 'Group'} ${mood} Journey`
    : travelers
    ? `${travelers === 'solo' ? 'Solo Explorer' : travelers === 'couple' ? 'Couple Escape' : travelers === 'family' ? 'Family Journey' : 'Group Adventure'}`
    : selectedDestination
    ? 'Building your journey...'
    : 'Select a destination to begin';

  const previewDestTour = selectedDestination ? TOURS_DATA.find(t => t.id === selectedDestination) : null;
  const previewSteps = [
    { label: 'From', value: fromLocation || null },
    { label: 'Destination', value: previewDestTour?.title || null },
    { label: 'Companion', value: COMPANION_OPTIONS.find(o => o.id === travelers)?.label || null },
    { label: 'Budget', value: BUDGET_OPTIONS.find(o => o.id === budget)?.label || null },
    { label: 'Style', value: STYLE_OPTIONS.find(o => o.id === mood)?.label || null },
    { label: 'Energy', value: ENERGY_OPTIONS.find(o => o.id === energy)?.label || null },
    { label: 'Duration', value: DURATION_OPTIONS.find(o => o.id === duration)?.desc || null },
  ];

  // ── 6-STEP QUESTIONNAIRE WIZARD ──
  return (
    <div className="pt-6 pb-32 px-4 md:px-6 max-w-7xl mx-auto min-h-screen bg-sand flex flex-col lg:flex-row gap-8 items-start justify-center select-none">
      
      {/* ── LEFT LIVE PREVIEW PANEL ── */}
      <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24">
        <div className="rounded-3xl border border-warm-gray bg-white shadow-card overflow-hidden">
          {/* Destination Preview Image */}
          <div className="relative aspect-[4/3] bg-cream overflow-hidden">
            {previewDestTour ? (
              <>
                <img
                  src={previewDestTour.bannerImage}
                  alt={previewDestTour.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                  onError={e => { e.currentTarget.style.opacity = '0' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-gold block mb-1">{previewDestTour.chapterName}</span>
                  <h3 className="font-display text-2xl text-white font-light lowercase leading-none">{previewDestTour.title}</h3>
                  <p className="text-[9px] text-white/60 mt-1">{previewDestTour.location.split(',')[0]}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-cream/60">
                <Compass className="w-10 h-10 text-muted/20 mb-2" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted/40">No destination yet</span>
              </div>
            )}
          </div>

          {/* Journey Profile Being Built */}
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 font-bold">Your Journey Profile</span>
              <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            </div>
            
            <p className="font-display text-lg text-night font-light lowercase leading-tight">{previewPersona.toLowerCase()}</p>

            <div className="space-y-2 pt-2 border-t border-warm-gray/40">
              {previewSteps.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="font-mono uppercase tracking-wider text-muted/50">{s.label}</span>
                  {s.value ? (
                    <span className="font-bold text-night truncate max-w-[130px] text-right">{s.value}</span>
                  ) : (
                    <span className="text-muted/30 italic">—</span>
                  )}
                </div>
              ))}
            </div>

            {step === totalSteps && duration && (
              <div className="pt-3 border-t border-warm-gray/40">
                <p className="text-[9px] font-mono text-muted/60 uppercase tracking-widest text-center">Ready to generate ✦</p>
              </div>
            )}
          </div>
        </div>

        {/* Journey theme chips if destination selected */}
        {previewDestTour && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {previewDestTour.tags?.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white border border-warm-gray text-[8px] font-mono uppercase tracking-wider text-muted/70">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT WIZARD PANEL ── */}
      <div className="flex-1 min-w-0 pt-4 pb-4 flex flex-col justify-center text-left">

      {/* Wizard Progress Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron font-bold block">Journey Builder</span>
            <span className="font-mono text-[10px] text-muted/50 uppercase tracking-widest">Craft your Indian story</span>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-light text-night">{step}</span>
            <span className="text-muted/50 font-mono text-sm">/{totalSteps}</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ease-out ${
                i < step ? 'bg-saffron' : i === step - 1 ? 'bg-saffron/80' : 'bg-cream'
              }`}
              style={{ flex: i < step ? '2 1 0' : '1 1 0' }}
            />
          ))}
        </div>
      </div>

    {/* ── STEP 1: FROM → TO ── */}
      {step === 1 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              plan your <span className="font-display italic text-gold">route</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Where are you coming from, and where in India are you heading? We'll factor in your departure point for smarter transit estimates.</p>
          </div>

          {/* From / To toggle */}
          <div className="bg-white rounded-2xl border border-warm-gray p-4 space-y-3">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 w-full">
                <label className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1.5">From Where?</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/40" />
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bangalore..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-warm-gray text-xs text-night placeholder:text-muted/30 outline-none focus:border-gold transition-colors bg-sand/30"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedDestination && fromLocation) {
                    const destName = TOURS_DATA.find(t => t.id === selectedDestination)?.title || '';
                    setFromLocation(destName);
                    setSelectedDestination(null);
                  }
                }}
                disabled={!selectedDestination || !fromLocation}
                className="self-end sm:self-center p-2.5 rounded-xl border border-warm-gray bg-white hover:bg-sand/40 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                title="Swap from/to"
              >
                <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16l-4-4 4-4" />
                  <path d="M17 8l4 4-4 4" />
                  <path d="M3 12h18" />
                </svg>
              </button>

              <div className="flex-1 w-full">
                <label className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1.5">Where To?</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold" />
                  <div className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-dashed border-warm-gray text-xs text-muted/40 bg-sand/20">
                    {selectedDestination ? getDestinationPrettyName(selectedDestination) : 'Select a destination below'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-night/60 block">Choose your destination</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[40dvh] overflow-y-auto pr-2 custom-scrollbar">
              {TOURS_DATA.map((tour) => {
                const isSelected = selectedDestination === tour.id;
                return (
                  <div
                    key={tour.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDestination(tour.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDestination(tour.id); } }}
                    className={`relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 ease-out group aspect-[4/3] ${
                      isSelected 
                        ? 'border-gold ring-2 ring-gold/30 shadow-elevated scale-[1.01] -translate-y-0.5' 
                        : 'border-warm-gray hover:border-gold hover:-translate-y-1 hover:shadow-card'
                    }`}
                  >
                    <img
                      src={tour.bannerImage}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                      onError={e => { e.currentTarget.style.opacity = '0' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left z-10">
                    <span className={`text-[8px] font-mono uppercase tracking-[0.25em] block mb-1 transition-colors duration-350 ${
                      isSelected ? 'text-gold' : 'text-gold/80'
                    }`}>{tour.chapterName || 'Chapter'}</span>
                    <h3 className={`font-display text-xl font-light lowercase leading-none transition-colors duration-350 ${
                      isSelected ? 'text-gold font-normal' : 'text-white'
                    }`}>{tour.title}</h3>
                    <p className="text-[9px] text-white/50 font-light mt-1.5 truncate max-w-[90%]">{tour.location.split(',')[0]}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-6.5 h-6.5 rounded-full bg-gold flex items-center justify-center shadow-elevated animate-scale-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      )}
      {/* ── STEP 2: COMPANION ── */}
      {step === 2 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              who is <span className="font-display italic text-gold">traveling</span>?
            </h2>
            <p className="text-xs text-muted/60 font-light">Your travel company shapes the itinerary rhythm — solo days move slowly, family trips need variety, couple escapes favor intimate corners.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPANION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = travelers === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setTravelers(opt.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTravelers(opt.id); } }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-4 items-center group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
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

      {/* ── STEP 3: BUDGET ── */}
      {step === 3 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              your <span className="font-display italic text-gold">budget</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Pick a tier, use the slider, or enter a custom amount — whatever works for your trip.</p>
          </div>

          {/* Budget Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = budget === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setBudget(opt.id);
                    const amounts: Record<string, number> = { Small: 5000, Medium: 15000, Luxury: 35000 };
                    setCustomBudgetAmount(amounts[opt.id] || 10000);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBudget(opt.id); } }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
                  }`}>
                    <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-1.5">
                      {opt.label}
                    </h3>
                    <p className="text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
                    <div className="mt-2 text-[11px] font-mono text-gold font-bold">
                      {opt.id === 'Small' ? '₹2,000 – ₹8,000' : opt.id === 'Medium' ? '₹8,000 – ₹25,000' : '₹25,000 – ₹60,000'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Range Slider */}
          <div className="bg-white rounded-2xl border border-warm-gray p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-mono uppercase tracking-widest text-muted/50">Per Person / Day</label>
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-display text-night font-bold">{customBudgetAmount.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-muted font-light">₹</span>
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={60000}
              step={500}
              value={customBudgetAmount}
              onChange={(e) => {
                setCustomBudgetAmount(Number(e.target.value));
                if (Number(e.target.value) <= 8000) setBudget('Small');
                else if (Number(e.target.value) <= 25000) setBudget('Medium');
                else setBudget('Luxury');
              }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-gold"
              style={{
                background: `linear-gradient(to right, #D6A85F 0%, #D6A85F ${(customBudgetAmount - 1000) / 59000 * 100}%, #E8E0D4 ${(customBudgetAmount - 1000) / 59000 * 100}%, #E8E0D4 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-muted/40 font-mono">
              <span>₹1k</span>
              <span>₹15k</span>
              <span>₹30k</span>
              <span>₹45k</span>
              <span>₹60k</span>
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="bg-sand/30 rounded-2xl border border-warm-gray p-4">
            <div className="flex items-center justify-between gap-4">
              <label className="text-[9px] font-mono uppercase tracking-widest text-muted/50 shrink-0">Custom Budget (₹)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-light">₹</span>
                <input
                  type="number"
                  min={1000}
                  max={100000}
                  step={500}
                  value={customBudgetAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1000 && val <= 100000) {
                      setCustomBudgetAmount(val);
                      if (val <= 8000) setBudget('Small');
                      else if (val <= 25000) setBudget('Medium');
                      else setBudget('Luxury');
                    }
                  }}
                  className="w-28 px-3 py-2 rounded-xl border border-warm-gray text-xs text-night text-right outline-none focus:border-gold bg-white"
                />
                <span className="text-[9px] text-muted/40 font-mono">/ day</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: STYLE ── */}
      {step === 4 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              your travel <span className="font-display italic text-gold">style</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">What drives your curiosity? Temples and rituals, mountain trails, street food crawls, or quiet retreats — your focus becomes our blueprint.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STYLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = mood === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setMood(opt.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMood(opt.id); } }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-4 items-center group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
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

      {/* ── STEP 5: TRIP ENERGY ── */}
      {step === 5 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              journey <span className="font-display italic text-gold">energy</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">Some journeys are about covering ground, others about sitting still. Tell us your pace and we'll calibrate the daily flow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ENERGY_OPTIONS.map((opt) => {
              const isSelected = energy === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setEnergy(opt.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEnergy(opt.id); } }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
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

      {/* ── STEP 6: DURATION ── */}
      {step === 6 && (
        <div className="space-y-6 animate-page-enter">
          <div className="space-y-1">
            <h2 className="font-display text-4xl font-light text-night lowercase leading-none">
              duration of <span className="font-display italic text-gold">stay</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">The number of days determines how deep we go. A weekend reveals the surface; two weeks lets us find the hidden corners.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = duration === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleDurationSelect(opt.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDurationSelect(opt.id); } }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
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
    </div>
  );
}
