"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, MapPin, Calendar, User, WandSparkles, ArrowRight, Plane, Car, Bus, 
  Landmark, Utensils, Hotel, Check, Info, ShieldAlert, Sparkles, HelpCircle, 
  Thermometer, Briefcase, ShoppingBag, Phone, IndianRupee, ChevronDown, Clock, Star,
  Heart, Download
} from 'lucide-react';
import { getDestinationImage } from '../../lib/getDestinationImage';

interface Place {
  name: string;
  description: string;
  visitDuration: string;
  entryFee: string;
  openingHours: string;
  rating: string;
  coordinates?: {
    lat: string;
    lng: string;
  };
  imageQueries?: string[];
  googleMapsSearch?: string;
}

interface Restaurant {
  name: string;
  reason: string;
  cuisine?: string;
  rating?: string;
  priceLevel?: string;
  distance?: string;
  openStatus?: string;
}

interface StayHotel {
  name: string;
  budgetType: string;
  reason: string;
  price?: string;
  rating?: string;
  location?: string;
}

interface DayPlan {
  day: number;
  title: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  places: Place[];
  restaurants?: Restaurant[];
  hotels?: StayHotel[];
  fuelStops?: string[];
  weather?: string;
  aiTips?: string[];
}

interface ItineraryData {
  hero: {
    destination?: string;
    coverImageQuery?: string;
    tripDuration?: string;
    travelMode?: string;
    bestTimeToVisit?: string;
    estimatedBudget?: string;
    tripSummary?: string;
  };
  overview: {
    startLocation: string;
    destination: string;
    totalDistance: string;
    totalTravelTime: string;
    currency: string;
    languages: string[];
    weatherSummary: string;
    bestSeason?: string;
    tripType?: string;
    difficulty?: string;
    estimatedDailyCost?: string;
    totalCost?: string;
    travelStyle?: string;
  };
  route: {
    mapSummary: string;
    majorStops: string[];
  };
  days: DayPlan[];
  expenseCalculator?: {
    fuel?: string;
    hotel?: string;
    food?: string;
    activities?: string;
    shopping?: string;
    miscellaneous?: string;
    estimatedTotal?: string;
  };
  packingChecklist?: string[];
  localFoods?: string[];
  shoppingPlaces?: string[];
  emergencyContacts?: {
    police?: string;
    ambulance?: string;
    touristHelpline?: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
}

const PLACE_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498307818166-524850d05f42?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
];

export default function JsonItineraryDashboard({ data }: { data: ItineraryData }) {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedPacking, setCheckedPacking] = useState<Record<string, boolean>>({});

  const destImage = useMemo(() => getDestinationImage(data.hero?.destination || ""), [data.hero?.destination]);
  const coverSrc = destImage.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

  const togglePackingItem = (item: string) => {
    setCheckedPacking(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const parseCost = (val?: string): number => {
    if (!val) return 0;
    const clean = val.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  };

  if (!data || !data.hero || !data.days || data.days.length === 0) return null;

  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[24px] overflow-hidden border border-border/40 shadow-lg bg-night text-white group/hero transition-all duration-300 hover:shadow-xl">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover/hero:scale-105 opacity-50 mix-blend-overlay" 
          style={{ backgroundImage: `url(${coverSrc})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent z-0" />
        
        <div className="relative z-10 p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-[0.2em] text-gold/90">Curated Journey</span>
            <h2 className="font-display text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight text-left">
              {data.hero.destination}
            </h2>
            {data.hero.destination?.includes(',') && (
              <span className="text-micro text-white/50 block font-light text-left">
                {data.hero.destination.split(',').slice(1).join(',').trim()}
              </span>
            )}
          </div>
          
          <p className="text-body text-white/90 leading-relaxed font-light italic max-w-2xl text-left border-l-2 border-gold/40 pl-3">
            "{data.hero.tripSummary}"
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-micro font-bold uppercase tracking-wider text-white border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-gold" /> {data.hero.tripDuration}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-micro font-bold uppercase tracking-wider text-white border border-white/5">
              <Compass className="w-3.5 h-3.5 text-coral" /> {data.hero.travelMode}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-micro font-bold uppercase tracking-wider text-white border border-white/5">
              <Thermometer className="w-3.5 h-3.5 text-teal" /> {data.hero.bestTimeToVisit}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-micro font-bold uppercase tracking-wider text-[#4ade80] border border-white/5 font-mono">
              <IndianRupee className="w-3.5 h-3.5 text-[#4ade80]" /> {data.hero.estimatedBudget}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.hero.destination || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gold hover:bg-gold/90 text-night font-bold text-micro tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-night" />
              Start Navigation
            </a>
            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-xl border border-white/25 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-micro tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4 text-white/80" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* 2. JOURNEY OVERVIEW */}
      <div className="bg-surface border border-border/40 rounded-[20px] p-5 sm:p-6 shadow-soft space-y-5 text-left">
        <div className="flex items-center gap-2 pb-3 border-b border-border/20">
          <WandSparkles className="w-4.5 h-4.5 text-gold" />
          <h3 className="font-display text-lg text-night font-bold">Journey Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal" /> Route
            </span>
            <p className="text-body text-night font-medium truncate">{data.overview.startLocation} &rarr; {data.overview.destination}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-coral" /> Distance
            </span>
            <p className="text-body text-night font-medium">{data.overview.totalDistance}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" /> Travel Time
            </span>
            <p className="text-body text-night font-medium">{data.overview.totalTravelTime}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-emerald-500" /> Weather
            </span>
            <p className="text-body text-night font-medium truncate" title={data.overview.weatherSummary}>{data.overview.weatherSummary.split(',')[0] || data.overview.weatherSummary}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-teal" /> Currency
            </span>
            <p className="text-body text-night font-medium">{data.overview.currency}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Est. Cost
            </span>
            <p className="text-body text-night font-medium font-mono text-emerald-600">{data.overview.totalCost || data.hero.estimatedBudget}</p>
          </div>
        </div>

        {/* Dynamic Second Row of Overview Fields */}
        <div className="pt-4 border-t border-border/20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" /> Best Season
            </span>
            <p className="text-body text-night font-medium truncate" title={data.overview.bestSeason || data.hero.bestTimeToVisit}>{data.overview.bestSeason || data.hero.bestTimeToVisit}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral" /> Trip Type
            </span>
            <p className="text-body text-night font-medium truncate">{data.overview.tripType || "Leisure"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal" /> Difficulty
            </span>
            <p className="text-body text-night font-medium truncate">{data.overview.difficulty || "Easy"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Est. Daily Cost
            </span>
            <p className="text-body text-night font-medium font-mono truncate">{data.overview.estimatedDailyCost || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 flex items-center gap-1.5">
              <WandSparkles className="w-3.5 h-3.5 text-gold" /> Travel Style
            </span>
            <p className="text-body text-night font-medium truncate">{data.overview.travelStyle || data.hero.travelMode}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/20 flex flex-col sm:flex-row justify-between gap-3 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 mr-1">Languages:</span>
            {data.overview.languages?.map(lang => (
              <span key={lang} className="px-2.5 py-0.5 rounded-lg bg-secondary-surface text-micro font-bold text-night border border-border/30">{lang}</span>
            ))}
          </div>
          <p className="text-caption text-muted/80 leading-relaxed font-light"><span className="font-mono text-micro font-bold text-muted/50 mr-1">WEATHER DETAIL:</span>{data.overview.weatherSummary}</p>
        </div>
      </div>

      {/* 3. MAP ROUTE SUMMARY */}
      {data.route && (
        <div className="bg-surface border border-border/40 rounded-[20px] p-5 shadow-soft space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-teal" />
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40">Transit Route & Stops</span>
          </div>
          <p className="text-body text-night/80 leading-relaxed font-light">{data.route.mapSummary}</p>
          {data.route.majorStops && data.route.majorStops.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
              {data.route.majorStops.map((stop, i) => (
                <div key={stop} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-teal/5 border border-teal/15 text-caption font-medium text-teal/80">{stop}</span>
                  {i < data.route.majorStops.length - 1 && <span className="text-muted/30 font-light">&rarr;</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. DAILY ITINERARY PLANNER */}
      <div className="space-y-4 text-left">
        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40 block">Daily Schedule</span>
        
        {data.days.map((dayPlan) => {
          const isExpanded = !!expandedDays[dayPlan.day];
          return (
            <div key={dayPlan.day} className="border border-border/30 rounded-[20px] bg-surface overflow-hidden shadow-soft transition-all duration-300">
              <button
                onClick={() => toggleDay(dayPlan.day)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-secondary-surface/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center font-mono font-bold text-gold shrink-0">
                    {dayPlan.day}
                  </div>
                  <div>
                    <h3 className="font-display text-card text-night font-bold leading-snug">
                      Day {dayPlan.day}: {dayPlan.title}
                    </h3>
                    {dayPlan.weather && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal/80 font-mono mt-0.5">
                        <Thermometer className="w-3 h-3" /> {dayPlan.weather}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 border-t border-border/20 space-y-6">
                      
                      {/* Morning, Afternoon, Evening */}
                      <div className="space-y-4">
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40 block">Daily Agenda</span>
                        <div className="relative border-l border-border/50 pl-5 ml-2.5 space-y-5">
                          {dayPlan.morning && dayPlan.morning.length > 0 && (
                            <div className="relative">
                              <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-gold ring-4 ring-gold/10" />
                              <span className="text-micro font-mono font-bold uppercase tracking-wider text-gold/80 block">Morning</span>
                              <div className="space-y-1 mt-1 text-body text-night/85 font-light">
                                {dayPlan.morning.map((act, i) => <p key={i}>{act}</p>)}
                              </div>
                            </div>
                          )}
                          
                          {dayPlan.afternoon && dayPlan.afternoon.length > 0 && (
                            <div className="relative">
                              <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-coral ring-4 ring-coral/10" />
                              <span className="text-micro font-mono font-bold uppercase tracking-wider text-coral/80 block">Afternoon</span>
                              <div className="space-y-1 mt-1 text-body text-night/85 font-light">
                                {dayPlan.afternoon.map((act, i) => <p key={i}>{act}</p>)}
                              </div>
                            </div>
                          )}

                          {dayPlan.evening && dayPlan.evening.length > 0 && (
                            <div className="relative">
                              <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-teal ring-4 ring-teal/10" />
                              <span className="text-micro font-mono font-bold uppercase tracking-wider text-teal/80 block">Evening</span>
                              <div className="space-y-1 mt-1 text-body text-night/85 font-light">
                                {dayPlan.evening.map((act, i) => <p key={i}>{act}</p>)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Places (Attractions) */}
                      {dayPlan.places && dayPlan.places.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40 block">Featured Attractions</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dayPlan.places.map((place, idx) => {
                              const imgUrl = PLACE_IMAGES[(dayPlan.day + idx) % PLACE_IMAGES.length];
                              return (
                                <div key={place.name} className="flex flex-col bg-surface border border-border/40 rounded-xl overflow-hidden shadow-sm group/place transition-shadow hover:shadow-md">
                                  <div className="h-40 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${imgUrl})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white text-left">
                                      <div>
                                        <h4 className="text-body font-bold truncate pr-2 text-white">{place.name}</h4>
                                        <span className="text-micro text-white/60 font-light flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-gold" /> Location details
                                        </span>
                                      </div>
                                      {place.rating && (
                                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-black/40 text-micro font-bold shrink-0 border border-white/10">
                                          <Star className="w-3 h-3 text-gold fill-gold" /> {place.rating}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="p-4 space-y-3 text-left flex-1 flex flex-col justify-between">
                                    <p className="text-caption text-muted/80 leading-relaxed font-light line-clamp-3">{place.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/20 text-micro font-mono font-bold text-muted/60 uppercase">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-muted/45" /> {place.visitDuration}
                                      </div>
                                      <div className="flex items-center gap-1.5 truncate">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted/45" /> {place.entryFee || 'Free'}
                                      </div>
                                    </div>

                                    {place.openingHours && (
                                      <p className="text-micro text-muted/50 font-mono flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-muted/30" /> Hours: {place.openingHours}
                                      </p>
                                    )}

                                    <div className="flex justify-between items-center pt-2">
                                      {place.googleMapsSearch && (
                                        <a
                                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleMapsSearch)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-micro font-mono font-bold text-gold hover:text-gold/80 uppercase tracking-wider transition-colors cursor-pointer"
                                        >
                                          <MapPin className="w-3.5 h-3.5" /> Navigate Map
                                        </a>
                                      )}
                                      <button 
                                        onClick={() => alert("Added to Saved Places!")}
                                        className="text-muted hover:text-coral transition-colors p-1.5 rounded-full hover:bg-secondary-surface"
                                        aria-label="Save place"
                                      >
                                        <Heart className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Hotels & Dining */}
                      {(dayPlan.restaurants || dayPlan.hotels) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                          
                          {/* Restaurants */}
                          {dayPlan.restaurants && dayPlan.restaurants.length > 0 && (
                            <div className="space-y-3">
                              <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40 block">Dining Recommendations</span>
                              <div className="space-y-3">
                                {dayPlan.restaurants.map((rest) => (
                                  <div key={rest.name} className="p-3 bg-surface border border-border/40 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                                    <div className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 border border-border/30" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80)` }} />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex justify-between items-start gap-1">
                                        <h4 className="text-caption font-bold text-night truncate">{rest.name}</h4>
                                        <span className="flex items-center gap-0.5 text-micro font-mono font-bold text-gold shrink-0">
                                          <Star className="w-3 h-3 fill-gold" /> {rest.rating || "4.6"}
                                        </span>
                                      </div>
                                      <p className="text-caption text-muted/80 leading-relaxed font-light mt-0.5 line-clamp-2">{rest.reason}</p>
                                      <div className="flex gap-2 items-center text-micro text-muted/50 font-mono mt-1">
                                        <span>{rest.cuisine || "Indian & Local"}</span>
                                        <span>•</span>
                                        <span className="text-emerald-500 font-bold">{rest.priceLevel || "₹₹"}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Accommodations (Hotels) */}
                          {dayPlan.hotels && dayPlan.hotels.length > 0 && (
                            <div className="space-y-3">
                              <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40 block">Accommodations</span>
                              <div className="space-y-3">
                                {dayPlan.hotels.map((hotel) => (
                                  <div key={hotel.name} className="p-3 bg-surface border border-border/40 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                                    <div className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 border border-border/30" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=80)` }} />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex justify-between items-start gap-1">
                                        <h4 className="text-caption font-bold text-night truncate pr-1">{hotel.name}</h4>
                                        <span className="px-1.5 py-0.5 rounded bg-teal/5 border border-teal/15 text-micro font-mono font-bold text-teal/80 uppercase tracking-wider shrink-0">{hotel.budgetType || "Mid-Range"}</span>
                                      </div>
                                      <p className="text-caption text-muted/80 leading-relaxed font-light mt-0.5 line-clamp-2">{hotel.reason}</p>
                                      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-border/10">
                                        <span className="text-micro font-mono font-bold text-emerald-500">{hotel.price || "₹3,200/night"}</span>
                                        <button 
                                          onClick={() => alert("Hotel Booking option coming soon!")}
                                          className="px-2.5 py-1 rounded bg-teal hover:bg-teal/90 text-white font-bold text-micro uppercase tracking-wider transition-colors cursor-pointer"
                                        >
                                          Book Room
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Fuel / Transit Stops */}
                      {dayPlan.fuelStops && dayPlan.fuelStops.length > 0 && (
                        <div className="p-3.5 bg-secondary-surface/30 border border-border/30 rounded-xl space-y-2">
                          <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50 block">Transit Stops</span>
                          <div className="flex flex-wrap gap-2">
                            {dayPlan.fuelStops.map((stop) => (
                              <span key={stop} className="px-2.5 py-1 rounded-lg bg-surface border border-border/30 text-caption font-medium text-night/80">{stop}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Tips / Advice */}
                      {dayPlan.aiTips && dayPlan.aiTips.length > 0 && (
                        <div className="p-4 bg-gold/5 border border-gold/15 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-2 text-gold">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-micro font-mono font-bold uppercase tracking-wider">Expert Advice</span>
                          </div>
                          <ul className="space-y-1 pl-4 list-disc text-caption text-muted/80 leading-relaxed font-light">
                            {dayPlan.aiTips.map((tip, i) => <li key={i}>{tip}</li>)}
                          </ul>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 5. EXPENSE CALCULATOR */}
      {data.expenseCalculator && (
        <div className="bg-surface border border-border/40 rounded-[20px] p-5 sm:p-6 shadow-soft space-y-5 text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-border/20">
            <IndianRupee className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="font-display text-lg text-night font-bold">Estimated Cost & Budget</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Left side categories with progress bars */}
            <div className="space-y-3.5">
              {[
                { label: 'Lodging / Accommodation', key: 'hotel', costStr: data.expenseCalculator.hotel, color: 'bg-teal' },
                { label: 'Food & Dining', key: 'food', costStr: data.expenseCalculator.food, color: 'bg-coral' },
                { label: 'Sightseeing & Activities', key: 'activities', costStr: data.expenseCalculator.activities, color: 'bg-gold' },
                { label: 'Transport / Fuel', key: 'fuel', costStr: data.expenseCalculator.fuel, color: 'bg-blue-500' },
                { label: 'Shopping', key: 'shopping', costStr: data.expenseCalculator.shopping, color: 'bg-purple-500' },
                { label: 'Miscellaneous', key: 'miscellaneous', costStr: data.expenseCalculator.miscellaneous, color: 'bg-muted' }
              ].map((cat) => {
                if (!cat.costStr) return null;
                const cost = parseCost(cat.costStr);
                const total = parseCost(data.expenseCalculator?.estimatedTotal);
                const percent = total > 0 ? Math.min(100, Math.round((cost / total) * 100)) : 20;
                return (
                  <div key={cat.key} className="space-y-1">
                    <div className="flex justify-between items-center text-caption font-medium">
                      <span className="text-night/80">{cat.label}</span>
                      <span className="font-mono text-night">{cat.costStr}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary-surface rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side summary panel */}
            <div className="flex flex-col justify-center items-center p-5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl text-center space-y-2">
              <span className="text-micro font-mono font-bold uppercase tracking-wider text-emerald-600/80">Total Estimated Budget</span>
              <span className="font-mono text-2xl sm:text-3xl text-emerald-600 font-bold">
                {data.expenseCalculator.estimatedTotal || "Calculated at checkout"}
              </span>
              <p className="text-micro text-muted/65 leading-relaxed font-light">
                *Estimated total is per person and covers base transportation, mid-range stays, dining, and site admissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. PACKING CHECKLIST & LOCAL FOODS */}
      {(data.packingChecklist || data.localFoods) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {data.packingChecklist && data.packingChecklist.length > 0 && (
            <div className="bg-surface border border-border/40 rounded-[20px] p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-teal" />
                  <h4 className="font-display text-night font-bold">Packing Checklist</h4>
                </div>
                <span className="text-[11px] font-mono text-muted/60">
                  {Object.values(checkedPacking).filter(Boolean).length} / {data.packingChecklist.length} packed
                </span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                {data.packingChecklist.map((item) => {
                  const isChecked = !!checkedPacking[item];
                  return (
                    <div
                      key={item}
                      onClick={() => togglePackingItem(item)}
                      className="flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-secondary-surface/40 transition-colors cursor-pointer select-none border border-transparent hover:border-border/30"
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-teal border-teal text-white shadow-sm shadow-teal/10 scale-95' 
                          : 'border-border/60 bg-transparent scale-100'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className={`text-body transition-all ${isChecked ? 'line-through text-muted/45 font-light' : 'text-night/85 font-light'}`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.localFoods && data.localFoods.length > 0 && (
            <div className="bg-surface border border-border/40 rounded-[20px] p-5 shadow-soft space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <Utensils className="w-4.5 h-4.5 text-coral" />
                <h4 className="font-display text-night font-bold">Local Flavors to Try</h4>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                {data.localFoods.map((food) => (
                  <div key={food} className="flex items-start gap-2.5 py-1.5 px-2 rounded-xl hover:bg-secondary-surface/30">
                    <span className="text-coral/50 font-bold shrink-0">✦</span>
                    <span className="text-body text-night/80 font-light leading-relaxed">{food}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. SHOPPING PLACES & EMERGENCY CONTACTS */}
      {(data.shoppingPlaces || data.emergencyContacts) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {data.shoppingPlaces && data.shoppingPlaces.length > 0 && (
            <div className="bg-surface border border-border/40 rounded-[20px] p-5 shadow-soft space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <ShoppingBag className="w-4.5 h-4.5 text-gold" />
                <h4 className="font-display text-night font-bold">Shopping & Local Markets</h4>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                {data.shoppingPlaces.map((place) => (
                  <div key={place} className="flex items-start gap-2.5 py-1.5 px-2 rounded-xl hover:bg-secondary-surface/30">
                    <span className="text-gold/50 font-bold shrink-0">✦</span>
                    <span className="text-body text-night/80 font-light leading-relaxed">{place}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.emergencyContacts && (
            <div className="bg-surface border border-border/40 rounded-[20px] p-5 shadow-soft space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <Phone className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                <h4 className="font-display text-night font-bold">Emergency Contacts</h4>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {data.emergencyContacts.police && (
                  <div className="flex justify-between items-center py-2 border-b border-border/10">
                    <span className="text-micro text-muted/50 font-bold uppercase">Police</span>
                    <span className="text-body text-rose-600 font-bold">{data.emergencyContacts.police}</span>
                  </div>
                )}
                {data.emergencyContacts.ambulance && (
                  <div className="flex justify-between items-center py-2 border-b border-border/10">
                    <span className="text-micro text-muted/50 font-bold uppercase">Ambulance</span>
                    <span className="text-body text-rose-600 font-bold">{data.emergencyContacts.ambulance}</span>
                  </div>
                )}
                {data.emergencyContacts.touristHelpline && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-micro text-muted/50 font-bold uppercase">Tourist Helpline</span>
                    <span className="text-body text-rose-600 font-bold">{data.emergencyContacts.touristHelpline}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. FAQs SECTION */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="bg-surface border border-border/40 rounded-[20px] p-5 sm:p-6 shadow-soft space-y-4 text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-border/20">
            <HelpCircle className="w-4.5 h-4.5 text-teal" />
            <h3 className="font-display text-lg text-night font-bold">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-2.5">
            {data.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-border/30 rounded-xl overflow-hidden bg-surface transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-secondary-surface/40 transition-colors cursor-pointer"
                  >
                    <span className="font-sans text-[15px] font-semibold text-night pr-4">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-muted/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="bg-secondary-surface/20 border-t border-border/10"
                      >
                        <div className="p-4 text-body text-muted/80 leading-relaxed font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
