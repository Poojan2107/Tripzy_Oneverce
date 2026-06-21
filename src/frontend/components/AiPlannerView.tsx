"use client";
import { useState, useEffect, useMemo } from 'react';
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
import { parseBudgetRange } from '../utils/budget';

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

  // Destination-aware budget range: pull from selected tour's budgetRange field
  const selectedTour = selectedDestination ? (allTours.find(t => t.id === selectedDestination || t.dbId === selectedDestination) || TOURS_DATA.find(t => t.id === selectedDestination)) : null;
  const destBudgetRange = selectedTour ? parseBudgetRange(selectedTour.budgetRange) : null;
  const budgetSliderMin = Math.max(5000, destBudgetRange?.min || 5000);
  const budgetSliderMax = destBudgetRange?.max || 60000;

  // Derive tier from actual amount using fixed thresholds
  const derivedBudgetTier = useMemo(() => {
    if (customBudgetAmount <= 15000) return 'Small';
    if (customBudgetAmount <= 40000) return 'Medium';
    return 'Luxury';
  }, [customBudgetAmount]);

  // When destination changes, reset slider to middle of that destination's range
  useEffect(() => {
    if (destBudgetRange) {
      const mid = Math.round((destBudgetRange.min + destBudgetRange.max) / 2 / 500) * 500;
      setCustomBudgetAmount(mid);
    }
  }, [selectedDestination]);

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
  const [budgetInteracted, setBudgetInteracted] = useState(false);
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
      setCustomBudgetAmount(loadedItinerary.budget || 1500);
      setBudget(loadedItinerary.budget >= 5000 ? 'Luxury' : loadedItinerary.budget >= 1500 ? 'Medium' : 'Small');
      setBudgetInteracted(true);
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
      case 3: return budget !== null || budgetInteracted;
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
      <div className="pt-28 pb-32 px-6 max-w-lg mx-auto min-h-[100dvh] bg-sand flex flex-col items-center justify-center text-center">
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
        <div className="pt-28 pb-32 px-6 max-w-md mx-auto min-h-[100dvh] bg-sand flex items-center justify-center">
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
      <div className="min-h-[100dvh] bg-[#F7F4EF] select-none text-left">

        {/* ── EDITORIAL MASTHEAD ── */}
        <div className="bg-night relative overflow-hidden">
          {/* Destination image behind the header at low opacity */}
          {tour?.bannerImage && (
            <div className="absolute inset-0 opacity-[0.12]">
              <img src={tour.bannerImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-night/60" />
            </div>
          )}
          {/* ATLAS VIVANT diagonal watermark */}
          <div className="absolute right-8 top-0 bottom-0 flex items-center pointer-events-none select-none" style={{ writingMode: 'vertical-rl' }}>
            <span className="font-display text-[80px] font-bold text-white/[0.03] uppercase tracking-widest leading-none">ATLAS VIVANT</span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Left: Brand + Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full border border-gold/60 flex items-center justify-center">
                      <Compass className="w-2.5 h-2.5 text-gold" />
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gold font-bold">tripzy.ai · atlas vivant</span>
                  </div>
                  <span className="h-px w-6 bg-white/20" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">{getJourneyPersona()}</span>
                </div>
                <h1 className="font-display text-white font-light lowercase leading-none" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                  your <em className="text-gold not-italic">{getDestinationPrettyName(destId).toLowerCase()}</em> journal
                </h1>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
                  {customDuration} days · {itin.length} chapters · crafted for {travelers || 'the explorer'}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                {!savedId ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-night text-[10px] font-bold uppercase tracking-wider hover:bg-gold/80 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saving ? 'Archiving...' : 'Save to Passport'}
                  </button>
                ) : (
                  <span className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" /> Archived
                  </span>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  ↺ New Journey
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CINEMATIC FILM-STRIP SUMMARY ── */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="rounded-3xl overflow-hidden border border-warm-gray shadow-card bg-white relative">
            {/* Atlas Vivant watermark inside card */}
            <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden">
              <span className="font-display text-[120px] font-bold text-night/[0.025] uppercase tracking-widest leading-none whitespace-nowrap">TRIPZY</span>
            </div>

            <div className="flex flex-col md:flex-row relative z-10">
              {/* Left: Destination image */}
              <div className="relative w-full md:w-64 shrink-0 aspect-[16/9] md:aspect-auto min-h-[160px] overflow-hidden">
                {tour?.bannerImage ? (
                  <>
                    <img src={tour.bannerImage} alt={getDestinationPrettyName(destId)} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.opacity = '0' }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-night/5 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-muted/20" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-2">
                  <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">{tour?.chapterName || 'Chapter'} · {tour?.chapterTitle || getDestinationPrettyName(destId)}</span>
                  <span className="font-display text-2xl text-white font-light lowercase leading-none block">{getDestinationPrettyName(destId).toLowerCase()}</span>
                </div>
                {/* Wax seal on image */}
                <WaxSeal text="TRIPZY APPROVED" subtext="ATLAS VIVANT" />
              </div>

              {/* Right: Stats strip */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  {/* Match score */}
                  <div className="text-center">
                    <span className="font-display text-4xl font-light text-saffron leading-none block">{itineraryResult.recommendationScore || 96}<span className="text-2xl">%</span></span>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-muted/50 block mt-1.5">ai match score</span>
                  </div>
                  {/* Total cost */}
                  <div className="text-center border-l border-warm-gray/40">
                    <span className="font-display text-3xl font-light text-night leading-none block">₹{(costs.total / 1000).toFixed(0)}k</span>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-muted/50 block mt-1.5">est. total</span>
                  </div>
                  {/* Best season */}
                  <div className="text-center border-l border-warm-gray/40">
                    <span className="font-display text-xl font-light text-gold leading-snug block">{(tour?.bestSeason || 'Oct – Mar').split(' to ')[0]}</span>
                    <span className="text-[7px] font-mono text-muted/40 block">to {(tour?.bestSeason || 'Oct – Mar').split(' to ')[1] || 'Mar'}</span>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-muted/50 block mt-1">best season</span>
                  </div>
                  {/* Duration */}
                  <div className="text-center border-l border-warm-gray/40">
                    <span className="font-display text-4xl font-light text-night leading-none block">{customDuration}</span>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-muted/50 block mt-1.5">day journey</span>
                  </div>
                </div>

                {/* AI Reasoning */}
                {itineraryResult.recommendationReasoning && (
                  <div className="border-t border-warm-gray/40 pt-4">
                    <div className="flex gap-3 items-start">
                      <span className="font-display text-4xl text-gold/30 leading-none mt-[-6px] shrink-0">"</span>
                      <p className="text-[11px] text-muted/70 font-light leading-relaxed italic">
                        {itineraryResult.recommendationReasoning}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-px flex-1 bg-cream" />
                      <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-muted/30">tripzy ai · atlas vivant intelligence</span>
                      <div className="h-px flex-1 bg-cream" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div id="itinerary-main-grid" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

             {/* ── LEFT COLUMN (col-span-4): Map + Boarding Pass + Atmosphere (Scrolling) + Chapters + Scratchpad (Sticky) ── */}
            <div className="xl:col-span-4 space-y-5">
              
              {/* Route Map Card */}
              <div className="bg-white border border-warm-gray rounded-3xl overflow-hidden shadow-card">
                <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-warm-gray/40">
                  <div>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-muted/40 block">route map</span>
                    <span className="font-display text-lg text-night font-light lowercase leading-tight">{getDestinationPrettyName(destId)}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-saffron/10 text-saffron text-[8px] font-bold uppercase tracking-wider border border-saffron/20 shrink-0">
                    {itineraryResult.recommendationScore || 96}% fit
                  </span>
                </div>
                <div className="h-52 w-full">
                  <ItineraryMap days={itin} activeDay={activeDayTab} />
                </div>
                <div className="px-5 py-3 border-t border-warm-gray/40 bg-sand/30">
                  <p className="text-[9px] text-muted/60 font-light leading-relaxed">
                    {tour?.storyNarrative || 'A custom-calibrated route reflecting your style and companion preferences.'}
                  </p>
                </div>
              </div>

              {/* Premium Boarding Pass */}
              <div className="bg-[#FDFAF6] border border-warm-gray/60 rounded-3xl relative overflow-hidden shadow-card paper-grain">
                {/* Perforated ticket holes */}
                <div className="absolute top-[54%] -left-3.5 w-7 h-7 bg-[#F7F4EF] rounded-full border-r border-warm-gray/50 z-20" />
                <div className="absolute top-[54%] -right-3.5 w-7 h-7 bg-[#F7F4EF] rounded-full border-l border-warm-gray/50 z-20" />

                {/* Header strip */}
                <div className="bg-night px-5 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-gold block">tripzy.ai · atlas vivant</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Journey Boarding Pass</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] font-mono text-white/30 block uppercase tracking-widest">Flight No.</span>
                    <span className="text-[10px] font-mono font-bold text-gold">TZ-{destId.slice(0,3).toUpperCase()}-{customDuration}D</span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-5 space-y-4">
                  {/* From → To */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                       <span className="text-[7.5px] font-mono uppercase tracking-wider text-muted/50 block">from</span>
                      <span className="font-display text-xl font-light text-night leading-none">{fromLocation ? fromLocation.split(',')[0].slice(0,3).toUpperCase() : 'YOR'}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="h-px flex-1 border-t border-dashed border-warm-gray/60" />
                      <Compass className="w-3 h-3 text-gold" />
                      <div className="h-px flex-1 border-t border-dashed border-warm-gray/60" />
                    </div>
                    <div className="text-center">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-muted/50 block">to</span>
                      <span className="font-display text-xl font-light text-saffron leading-none">{getDestinationPrettyName(destId).slice(0,3).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Perforated divider */}
                  <div className="border-t border-dashed border-warm-gray/60 relative">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-[#FDFAF6] px-2 text-[7px] font-mono text-muted/30 uppercase tracking-widest">cost breakdown</span>
                  </div>

                  {/* Costs */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted/70 font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-saffron/50 block" />Transit & transfers
                      </span>
                      <span className="font-semibold text-night font-mono">₹{costs.transit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted/70 font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold/50 block" />Accommodations
                      </span>
                      <span className="font-semibold text-night font-mono">₹{costs.stay.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted/70 font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-sage/50 block" />Food & experiences
                      </span>
                      <span className="font-semibold text-night font-mono">₹{costs.food.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-dashed border-warm-gray/60 pt-4 flex justify-between items-end">
                    <div>
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-muted/40 block mb-1">estimated total</span>
                      <span className="font-display text-3xl font-light text-night leading-none">₹{costs.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-muted/40 block mb-1">tier</span>
                      <span className="px-3 py-1 rounded bg-gold/15 text-gold text-[9px] font-bold uppercase tracking-wider border border-gold/30">
                        {budget === 'Luxury' ? 'Heritage' : budget === 'Medium' ? 'Curated' : 'Bespoke'}
                      </span>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="barcode-lines h-9 w-full rounded opacity-20 mt-2" />
                </div>
              </div>

              {/* Local Secrets & Atmosphere Card */}
              {atmo && (
                <div className="bg-[#FAF8F4] border border-warm-gray/60 rounded-3xl overflow-hidden shadow-card relative paper-grain">
                  {/* Washi tape header */}
                  <div className="absolute -top-3 left-6 w-24 h-6 washi-tape-sage rotate-[-1deg] z-10 flex items-center justify-center font-mono text-[7px] text-sage uppercase tracking-[0.2em] font-bold">
                    local character
                  </div>
                  
                  <div className="p-5 pt-8 space-y-4">
                    {/* Travel Quote */}
                    {atmo.travelQuote && (
                      <div className="relative pl-6 py-2 border-l border-gold/30 bg-white/40 rounded-r-xl">
                        <span className="absolute left-1.5 top-0 font-display text-3xl text-gold/30 leading-none">“</span>
                        <p className="text-xs text-night/70 font-light italic leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                          {atmo.travelQuote}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      {/* Local Secret */}
                      {atmo.localSecret && (
                        <div className="text-[11px] leading-relaxed">
                          <span className="font-mono text-[7.5px] uppercase tracking-wider text-saffron block font-bold mb-0.5">archival secret</span>
                          <p className="text-muted/80 font-light">{atmo.localSecret}</p>
                        </div>
                      )}

                      {/* Sunrise & Photography */}
                      {(atmo.bestSunriseTime || atmo.bestPhotoSpot) && (
                        <div className="text-[11px] leading-relaxed">
                          <span className="font-mono text-[7.5px] uppercase tracking-wider text-gold block font-bold mb-0.5">field photography</span>
                          <p className="text-muted/80 font-light text-[10.5px]">
                            {atmo.bestPhotoSpot ? `${atmo.bestPhotoSpot}` : ''}
                            {atmo.bestSunriseTime ? ` Recommended capture around ${atmo.bestSunriseTime}.` : ''}
                          </p>
                        </div>
                      )}

                      {/* Cultural Insight */}
                      {atmo.culturalInsight && (
                        <div className="text-[11px] leading-relaxed border-t border-warm-gray/30 pt-2.5">
                          <span className="font-mono text-[7.5px] uppercase tracking-wider text-sage block font-bold mb-0.5">cultural advisory</span>
                          <p className="text-muted/80 font-light">{atmo.culturalInsight}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STICKY SUB-CONTAINER (Interactive Elements) ── */}
              <div className="xl:sticky xl:top-[96px] space-y-5">

                {/* Journey Chapters Table of Contents */}
                <div className="bg-white border border-warm-gray rounded-3xl overflow-hidden shadow-card paper-grain">
                  <div className="px-5 pt-4 pb-3 border-b border-warm-gray/40">
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-muted/40 block">journey index</span>
                    <span className="font-display text-lg text-night font-light lowercase leading-tight">chapters & logs</span>
                  </div>
                  <div className="p-4 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {itin.map((dayItem: any, idx: number) => {
                      const isActive = activeDayTab === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveDayTab(idx);
                            // Scroll active content back to top of main grid
                            const gridEl = document.getElementById('itinerary-main-grid');
                            if (gridEl) {
                              gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className={`w-full flex items-start gap-3 p-2 rounded-xl text-left transition-all text-xs cursor-pointer border border-transparent ${
                            isActive
                              ? 'bg-gold/10 border-l-2 border-l-gold text-night font-medium shadow-soft'
                              : 'hover:bg-sand/35 text-muted/80'
                          }`}
                        >
                          <span className={`font-mono text-[9px] mt-0.5 ${isActive ? 'text-gold' : 'text-muted/40'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`truncate lowercase leading-tight ${isActive ? 'text-night font-medium' : 'text-muted/70'}`}>
                              {dayItem.title || `Day ${idx + 1}`}
                            </p>
                            {dayItem.activities && (
                              <span className="text-[8px] font-mono text-muted/40 uppercase block mt-0.5">
                                {dayItem.activities.length} chapter stops
                              </span>
                            )}
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold self-center shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field Notes Journal Scratchpad */}
                <div className="relative">
                  <div className="absolute -top-3 right-6 w-28 h-6 washi-tape-saffron rotate-[1.5deg] z-10 flex items-center justify-center font-mono text-[7px] text-saffron uppercase tracking-[0.2em] font-bold">
                    journal scratchpad
                  </div>
                  <div className="bg-[#FFFDF8] border border-warm-gray/80 rounded-3xl overflow-hidden shadow-card paper-grain">
                  
                  <div className="p-5 pt-8 space-y-3">
                    <div className="flex items-center justify-between border-b border-warm-gray/40 pb-1.5">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 font-bold">your field notes</span>
                      <span className="text-[7px] font-mono text-muted/40 uppercase">saved to passport</span>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="jot down packing checklists, local contact details, ticket references, or street vendor recommendations here..."
                        className="w-full min-h-[120px] p-3.5 text-xs text-night placeholder:text-muted/30 border border-warm-gray/60 rounded-2xl focus:border-gold outline-none resize-none font-sans leading-relaxed bg-[#FAF8F3] shadow-inner"
                        style={{
                          backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)',
                          backgroundSize: '100% 24px',
                          lineHeight: '24px',
                          paddingTop: '6px'
                        }}
                      />
                    </div>
                  </div>
                </div>
                </div>

              </div>

            </div>

            {/* ── RIGHT COLUMN (col-span-8): Day Log + Insights + Hotels ── */}
            <div className="xl:col-span-8 space-y-6">

              {/* ── DAY SELECTOR: Ticket Stubs ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-muted/50 font-bold">day-by-day itinerary</span>
                  <span className="h-px flex-1 bg-warm-gray/60" />
                  <span className="text-[8px] font-mono text-muted/40">{itin.length} chapters</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
                  {itin.map((dayItem: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDayTab(idx)}
                      className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                        activeDayTab === idx
                          ? 'bg-night text-white border-night shadow-md'
                          : 'bg-white text-muted border-warm-gray hover:border-gold/60 hover:bg-sand/30'
                      }`}
                      style={{ minWidth: '64px', scrollSnapAlign: 'start' }}
                    >
                      {activeDayTab === idx && (
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-gold" />
                      )}
                      <span className={`font-display text-xl font-light leading-none ${activeDayTab === idx ? 'text-white' : 'text-night'}`}>{idx + 1}</span>
                      <span className={`text-[7px] font-mono uppercase tracking-wider mt-1 ${activeDayTab === idx ? 'text-gold' : 'text-muted/50'}`}>day</span>
                      {dayItem.activities && (
                        <span className={`text-[6px] font-mono mt-0.5 ${activeDayTab === idx ? 'text-white/50' : 'text-muted/30'}`}>{dayItem.activities.length} stops</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── ACTIVE DAY: Field Journal Card ── */}
              <div className="relative animate-fade-in">
                <div className={`absolute -top-3 left-8 w-28 h-6 ${getWashiTapeClass(destId)} rotate-[-1.5deg] z-10 flex items-center justify-center font-mono text-[7px] uppercase tracking-[0.2em] font-bold`}>
                  day {activeDayTab + 1} · field log
                </div>
                <div className="bg-[#FFFDF8] border border-warm-gray/80 rounded-3xl overflow-hidden shadow-card paper-grain">

                {/* Day header */}
                <div className="px-7 pt-10 pb-5 border-b border-warm-gray/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[7.5px] font-mono uppercase tracking-[0.3em] text-saffron font-bold block mb-2">
                        chapter {activeDayTab + 1} of {itin.length}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-light text-night lowercase leading-tight">
                        {currentDay.title}
                      </h3>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-night/5 border border-warm-gray flex items-center justify-center">
                      <span className="font-display text-xl font-light text-night/40">{activeDayTab + 1}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted/70 leading-relaxed font-light font-sans mt-3 max-w-xl">
                    {currentDay.description}
                  </p>
                </div>

                {/* Timeline activities */}
                <div className="px-7 py-5">
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-muted/40 block mb-5 font-bold">today's schedule</span>
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[52px] top-2 bottom-2 w-px bg-warm-gray/60" />

                    <div className="space-y-5">
                      {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => {
                        const timeSlots = [
                          { label: 'Morning', time: '08:00', color: '#E07B39', bg: 'bg-saffron/10', text: 'text-saffron' },
                          { label: 'Midday', time: '13:00', color: '#D6A85F', bg: 'bg-gold/10', text: 'text-gold' },
                          { label: 'Evening', time: '18:00', color: '#0F172A', bg: 'bg-night/10', text: 'text-night' },
                        ];
                        const slot = timeSlots[aIdx] || { label: `Stop ${aIdx+1}`, time: '—', color: '#9CA3AF', bg: 'bg-cream', text: 'text-muted' };
                        return (
                          <div key={aIdx} className="flex gap-4 items-start relative">
                            {/* Time marker */}
                            <div className="shrink-0 text-right" style={{ width: '48px' }}>
                              <span className="text-[7.5px] font-mono text-muted/40 block leading-none">{slot.time}</span>
                              <span className={`text-[7px] font-mono uppercase tracking-wider ${slot.text} font-bold block mt-0.5`}>{slot.label}</span>
                            </div>

                            {/* Timeline dot */}
                            <div className="relative z-10 mt-0.5">
                              <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: slot.color }} />
                            </div>

                            {/* Activity */}
                            <div className={`flex-1 ${slot.bg} rounded-xl px-3.5 py-2.5 border border-warm-gray/30`}>
                              <p className="text-xs text-night font-medium leading-relaxed">{act}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* ── LOCAL INSIGHTS: Field Notes ── */}
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 washi-tape-sage rotate-[1deg] z-10 flex items-center justify-center font-mono text-[7px] text-sage uppercase tracking-[0.2em] font-bold">
                  field notes · atlas
                </div>
                <div className="bg-[#FAF8F4] border border-warm-gray/60 rounded-3xl overflow-hidden shadow-sm paper-grain">

                {/* Stamp header */}
                <div className="px-6 pt-10 pb-4 border-b border-warm-gray/40">
                  <div className="flex items-center gap-3">
                    <div className="border-2 border-night/20 rounded px-2.5 py-1.5 rotate-[-1deg]">
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-night/30 font-bold leading-none block">tripzy field notes</span>
                      <span className="font-mono text-[6px] uppercase tracking-[0.15em] text-night/20 block">atlas vivant · 2026</span>
                    </div>
                    <h3 className="font-display text-2xl font-light text-night lowercase leading-none">local insights</h3>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-4 text-xs">
                  {/* Weather — full width */}
                  <div className="sm:col-span-2 bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Sun className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-saffron block font-bold mb-0.5">weather conditions</span>
                      <span className="font-bold text-night text-sm">{weather.temperature}</span>
                      <span className="text-muted/60 ml-2">·</span>
                      <span className="text-muted/70 ml-2">{weather.conditions}</span>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-muted/40 block">best time</span>
                      <span className="text-xs font-bold text-night">{tour?.bestSeason || 'Oct – Mar'}</span>
                    </div>
                  </div>

                  {/* Nearby explorations */}
                  {itineraryResult.nearbyPlaces && itineraryResult.nearbyPlaces.length > 0 && (
                    <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.4deg]">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-gold block font-bold mb-1.5">nearby explorations</span>
                      <span className="font-semibold text-night block">{itineraryResult.nearbyPlaces[0].name}</span>
                      <span className="text-muted/50 text-[10px]">{itineraryResult.nearbyPlaces[0].distance} away</span>
                    </div>
                  )}

                  {/* Local cuisine */}
                  <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.6deg]">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-sage block font-bold mb-1.5">local cuisine</span>
                    <span className="text-night/80 leading-relaxed">{DEST_CUISINE[destId] || 'Street food walks · Thali experiences · Regional specialties'}</span>
                  </div>

                  {/* Transport */}
                  <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[-0.5deg]">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-ocean block font-bold mb-1.5">getting around</span>
                    <span className="text-night/80 leading-relaxed">{DEST_TRANSPORT[destId] || 'Private car with driver · Local auto-rickshaw · Shared taxis'}</span>
                  </div>

                  {/* Photography */}
                  <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[-0.8deg]">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-saffron block font-bold mb-1.5">photo spots</span>
                    <span className="text-night/80 leading-relaxed">{DEST_PHOTO[destId] || 'Sunrise vantage · Heritage architecture · Local market life · Natural landscapes'}</span>
                  </div>

                  {/* Packing */}
                  <div className="bg-white border border-warm-gray/50 p-4 rounded-2xl shadow-soft rotate-[0.3deg]">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-sage block font-bold mb-1.5">packing tips</span>
                    <span className="text-night/80 leading-relaxed">{DEST_PACKING[destId] || 'Light layers · Comfortable walking shoes · Sun protection · Power bank'}</span>
                  </div>
                </div>

                {/* Handwritten note */}
                <div className="px-6 pb-5 border-t border-warm-gray/30 pt-4 text-center">
                  <p className="text-muted/50 text-xl rotate-[-0.8deg] inline-block" style={{ fontFamily: 'var(--font-handwritten)' }}>
                    "live from the field: always keep local cash for auto-rickshaws!"
                  </p>
                </div>
              </div>
              </div>

              {/* ── WHERE TO STAY ── */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 bg-gold rounded-full" />
                  <div>
                    <span className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-muted/40 block">curated stays</span>
                    <h3 className="font-display text-xl text-night font-light lowercase leading-tight">where to stay · {getDestinationPrettyName(destId).toLowerCase()}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {itineraryResult.destinationId && getHotelsByDestination(itineraryResult.destinationId).length > 0 ? (
                    getHotelsByDestination(itineraryResult.destinationId).slice(0, 4).map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))
                  ) : itineraryResult.destinationDbId && getHotelsByDestination(itineraryResult.destinationDbId).length > 0 ? (
                    getHotelsByDestination(itineraryResult.destinationDbId).slice(0, 4).map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))
                  ) : (
                    <div className="sm:col-span-2 p-8 rounded-2xl bg-white border border-warm-gray text-center">
                      <Compass className="w-8 h-8 text-muted/20 mx-auto mb-3" />
                      <p className="text-xs text-muted font-light">Hotels for this destination are being curated. Check back soon.</p>
                    </div>
                  )}
                </div>
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
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  return (
    <div className="pt-6 pb-32 px-4 md:px-6 max-w-7xl mx-auto min-h-screen bg-sand flex flex-col lg:flex-row gap-8 items-start justify-center select-none">
      
      {/* ── MOBILE PROFILE ACCORDION ── */}
      <div className="w-full lg:hidden">
        <button
          onClick={() => setShowMobileProfile(!showMobileProfile)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-warm-gray shadow-sm text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-night/5 flex items-center justify-center">
              <User className="w-4 h-4 text-muted/60" />
            </div>
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block leading-none">Journey Profile</span>
              <span className="text-xs font-medium text-night">{previewPersona.toLowerCase()}</span>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${showMobileProfile ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-muted/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </button>
        {showMobileProfile && (
          <div className="mt-2 p-4 rounded-2xl bg-white border border-warm-gray shadow-sm space-y-3 animate-fade-in">
            {previewDestTour && (
              <div className="flex items-center gap-3 pb-3 border-b border-warm-gray/40">
                <img src={previewDestTour.bannerImage} alt={previewDestTour.title} className="w-12 h-12 rounded-xl object-cover" onError={e => { e.currentTarget.style.opacity = '0' }} />
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-gold block">{previewDestTour.chapterName || 'Chapter'}</span>
                  <span className="font-display text-lg text-night font-light lowercase leading-tight">{previewDestTour.title}</span>
                </div>
              </div>
            )}
            <p className="font-display text-lg text-night font-light lowercase leading-tight">{previewPersona.toLowerCase()}</p>
            <div className="space-y-1.5">
              {previewSteps.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="font-mono uppercase tracking-wider text-muted/50">{s.label}</span>
                  {s.value ? (
                    <span className="font-bold text-night truncate max-w-[120px] text-right">{s.value}</span>
                  ) : (
                    <span className="text-muted/30 italic">—</span>
                  )}
                </div>
              ))}
            </div>
            {step === totalSteps && duration && (
              <p className="text-[9px] font-mono text-muted/60 uppercase tracking-widest text-center pt-2 border-t border-warm-gray/40">Ready to generate ✦</p>
            )}
            {previewDestTour && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-warm-gray/40">
                {previewDestTour.tags?.slice(0, 4).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-sand border border-warm-gray text-[7px] font-mono uppercase tracking-wider text-muted/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* ── LEFT LIVE PREVIEW PANEL (desktop) ── */}
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
      <div className="flex-1 min-w-0 pt-4 pb-4 flex flex-col text-left">

      {/* Wizard Progress Header */}
      <div className="mb-6 md:mb-8 space-y-4">
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50dvh] md:max-h-[40dvh] overflow-y-auto pr-2 custom-scrollbar">
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
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
                  className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-3 md:gap-4 items-center group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-9 md:w-10 h-9 md:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
                  }`}>
                    <Icon className="w-4 md:w-5 h-4 md:h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-night font-light lowercase leading-none mb-1">
                      {opt.label}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-muted/60 font-light font-sans leading-relaxed">{opt.desc}</p>
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
              your <span className="font-display italic text-gold">budget</span>
            </h2>
            <p className="text-xs text-muted/60 font-light">
              {destBudgetRange
                ? `${selectedTour?.title || 'This destination'} trips typically range from ${selectedTour?.budgetRange} per person per day.`
                : 'Pick a tier, use the slider, or enter a custom amount.'}
            </p>
          </div>

          {/* Budget Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = budget === opt.id;
              const tierDisplay = opt.id === 'Small' ? { min: 5000, max: 15000 }
                : opt.id === 'Medium' ? { min: 15000, max: 40000 }
                : { min: 40000, max: null };
              const tierMidpoint = opt.id === 'Small' ? 10000
                : opt.id === 'Medium' ? 27500
                : 40000 + Math.round(Math.max(0, budgetSliderMax - 40000) / 2 / 500) * 500;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setBudget(opt.id);
                    setBudgetInteracted(true);
                    setCustomBudgetAmount(tierMidpoint);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBudget(opt.id); setBudgetInteracted(true); } }}
                  className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-3 md:gap-4 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-8 md:w-9 h-8 md:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
                  }`}>
                    <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-night font-light lowercase leading-none mb-1.5">
                      {opt.label}
                    </h3>
                    <p className="text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
                    <div className="mt-1 md:mt-2 text-[10px] md:text-[11px] font-mono text-gold font-bold">
                      {opt.id === 'Luxury'
                        ? `₹${tierDisplay.min.toLocaleString('en-IN')}+`
                        : `₹${tierDisplay.min.toLocaleString('en-IN')} – ₹${tierDisplay.max!.toLocaleString('en-IN')}`}
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
              min={budgetSliderMin}
              max={budgetSliderMax}
              step={500}
              value={customBudgetAmount}
                  onChange={(e) => {
                    setCustomBudgetAmount(Number(e.target.value));
                    setBudgetInteracted(true);
                  }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-gold
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #D6A85F 0%, #D6A85F ${((customBudgetAmount - budgetSliderMin) / (budgetSliderMax - budgetSliderMin)) * 100}%, #E8E0D4 ${((customBudgetAmount - budgetSliderMin) / (budgetSliderMax - budgetSliderMin)) * 100}%, #E8E0D4 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-muted/40 font-mono">
              <span>{Math.round(budgetSliderMin / 1000)}k</span>
              <span>15k</span>
              <span>40k</span>
              <span>{Math.round(budgetSliderMax / 1000)}k</span>
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
                  min={budgetSliderMin}
                  max={budgetSliderMax}
                  step={500}
                  value={customBudgetAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= budgetSliderMin && val <= budgetSliderMax) {
                      setCustomBudgetAmount(val);
                      setBudgetInteracted(true);
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
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
                  className={`p-3 md:p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex gap-3 md:gap-4 items-center group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-8 md:w-9 h-8 md:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-gold/15 text-gold' : 'bg-cream/50 text-muted/50 group-hover:text-gold/80 group-hover:bg-gold/5'
                  }`}>
                    <Icon className="w-4 md:w-4.5 h-4 md:h-4.5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-night font-light lowercase leading-none mb-0.5">
                      {opt.label}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
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
                  className={`p-3 md:p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <h3 className="font-display text-xl md:text-2xl text-night font-light lowercase leading-none mb-0.5">
                    {opt.label}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-muted/60 font-light leading-relaxed">{opt.desc}</p>
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
            <h2 className="font-display text-3xl md:text-4xl font-light text-night lowercase leading-none">
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
                  className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-1 text-left group ${
                    isSelected 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20 scale-[1.01] -translate-y-0.5' 
                      : 'bg-warm-white/70 border-warm-gray/60 hover:border-gold hover:bg-white/50 hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <h3 className="font-display text-xl md:text-2xl text-night font-light lowercase leading-none mb-0.5">
                    {opt.label}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-muted/60 font-light">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Bottom Controls */}
      <div className="mt-8 md:mt-12 flex justify-between items-center">
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
