"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2, Camera, Sparkles, KeyRound, MapPin, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TOURS_DATA } from '../../data';
import { getHotelsByDestination } from '../../data/hotels';
import HotelCard from '../HotelCard';
import { useToast } from '../ui/Toast';


const ItineraryMap = dynamic(() => import('../map/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-52 rounded-2xl bg-white animate-pulse flex items-center justify-center border border-border/40">
      <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/50">Plotting Route Map...</span>
    </div>
  )
});

interface PlannerResultProps {
  itineraryResult: any;
  customDuration: number;
  travelers: string | null;
  derivedBudgetTier: string;
  customBudgetAmount: number;
  fromLocation: string;
  selectedDestination: string | null;
  savedId: string | null;
  saving: boolean;
  activeDayTab: number;
  onActiveDayTabChange: (idx: number) => void;
  onSave: () => void;
  onReset: () => void;
  getJourneyPersona: () => string;
  getDestinationPrettyName: (id: string) => string;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (isNaN(value) || value <= 0) {
      setDisplay(value || 0);
      return;
    }
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(value / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(start);
    }, Math.max(16, duration / (value / step)));
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}{suffix}</>;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: "spring" as const, stiffness: 80, damping: 20 } }),
};

export default function PlannerResult({
  itineraryResult, customDuration, travelers, derivedBudgetTier, customBudgetAmount,
  fromLocation, selectedDestination, savedId, saving, activeDayTab,
  onActiveDayTabChange, onSave, onReset, getJourneyPersona, getDestinationPrettyName,
}: PlannerResultProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleCopyItineraryText = () => {
    try {
      const textParts: string[] = [];
      textParts.push(`JOURNEY ODYSSEY: ${getDestinationPrettyName(destId).toUpperCase()}`);
      textParts.push(`Duration: ${customDuration} Days | Mode: ${travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : 'Group'}`);
      textParts.push('');
      itin.forEach((day: any, idx: number) => {
        textParts.push(`DAY ${idx + 1}: ${day.title}`);
        textParts.push(day.description);
        if (day.activities && day.activities.length > 0) {
          textParts.push('Activities:');
          day.activities.forEach((act: string) => {
            textParts.push(`- ${act}`);
          });
        }
        textParts.push('');
      });
      navigator.clipboard.writeText(textParts.join('\n'));
      toast("Itinerary copied to clipboard!", "copy");
    } catch (e) {
      console.error(e);
      toast("Failed to copy itinerary text.", "error");
    }
  };

  if (itineraryResult.error) {
    return (
      <div className="pt-28 pb-32 px-6 w-full max-w-lg mx-auto min-h-[100dvh] bg-background flex items-center justify-center">
        <motion.div
          className="text-center p-10 bg-surface border border-border/70 rounded-2xl shadow-md space-y-6 text-night relative overflow-hidden w-full"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Subtle design flourish to match premium aesthetic */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-coral to-teal" />
          
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-8 h-8 text-gold animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-light text-night lowercase tracking-tight">journey interrupted</h2>
            <p className="text-meta font-mono text-gold uppercase tracking-widest">explorer sync delay</p>
          </div>

          <p className="text-body text-muted/80 font-light leading-relaxed max-w-md mx-auto">
            Our digital cartographer encountered a temporary sync delay while consulting the servers. Rest assured, your draft preferences are safe. Click below to reconnect and restore your journey.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <motion.button
              onClick={onReset}
              className="btn btn-primary w-full h-12 px-6 rounded-lg text-caption tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(244,182,61,0.25)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4 text-night animate-pulse" />
              <span>Restore Journey</span>
            </motion.button>
            <motion.button
              onClick={onReset}
              className="btn btn-outline border-border/80 text-muted hover:text-night w-full h-11 px-6 rounded-lg text-caption tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Back to Planner</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const itin = itineraryResult.itinerary || [];
  const rawCosts = itineraryResult.costs || {};
  const costs = {
    transit: typeof rawCosts.transit === 'number' ? rawCosts.transit : parseFloat(rawCosts.transit) || 0,
    stay: typeof rawCosts.stay === 'number' ? rawCosts.stay : parseFloat(rawCosts.stay) || 0,
    food: typeof rawCosts.food === 'number' ? rawCosts.food : parseFloat(rawCosts.food) || 0,
    total: typeof rawCosts.total === 'number' ? rawCosts.total : parseFloat(rawCosts.total) || 0,
  };
  if (costs.total === 0) {
    costs.total = costs.transit + costs.stay + costs.food;
  }
  const currentDay = itin[activeDayTab] || {};
  const destId = itineraryResult.destinationId || selectedDestination || '';
  const tour = TOURS_DATA.find(t => t.id === destId);

  return (
    <motion.div
      className="min-h-[100dvh] bg-background text-night select-none text-left pt-6 pb-[calc(var(--nav-bottom-height)+2rem)] md:pb-24"
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
    >
      {itineraryResult.isOfflineFallback && (
        <div className="max-w-4xl mx-auto px-6 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold">
            <Compass className="w-3 h-3" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest">Curated Explorer Edition</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-6 space-y-16">

        {/* 1. Journey Hero */}
        <motion.div className="bg-surface relative overflow-hidden border border-border/70 rounded-lg shadow-md" variants={sectionVariants} custom={0}>
          {tour?.bannerImage && (
            <div className="absolute inset-0 opacity-[0.08]">
              <img src={tour.bannerImage} alt="" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent" />
            </div>
          )}
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-border/15">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-gold animate-spin-slow" />
                  <span className="text-meta font-mono text-gold block">travebie.ai · companion journal</span>
                </div>
                <h1 className="font-display text-night font-light lowercase leading-none mt-1" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                  your <em className="text-gold not-italic">{getDestinationPrettyName(destId).toLowerCase()}</em> odyssey
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-sm bg-background border border-border text-meta font-mono font-bold uppercase text-night">{customDuration} Days</span>
                  <span className="px-2.5 py-1 rounded-sm bg-background border border-border text-meta font-mono font-bold uppercase text-night">{itin.length} Chapters</span>
                  {itineraryResult.recommendationScore && (
                    <span className="px-2.5 py-1 rounded-sm bg-coral/10 border border-coral/20 text-meta font-mono font-bold uppercase text-coral">{itineraryResult.recommendationScore}% Match</span>
                  )}
                  <span className="px-2.5 py-1 rounded-sm bg-teal/10 border border-teal/20 text-meta font-mono font-bold uppercase text-teal">Crafted For {travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : travelers === 'friends' ? 'Group' : 'Explorer'}</span>
                </div>
              </div>
 
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
                {!savedId ? (
                  <motion.button
                    onClick={onSave}
                    disabled={saving}
                    className="btn btn-primary h-11 px-5 rounded-md text-caption flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {saving ? 'Archiving...' : 'Save to Passport'}
                  </motion.button>
                ) : (
                  <motion.span
                    className="px-4 py-2.5 rounded-md bg-secondary-surface text-muted text-meta font-mono border border-border flex items-center gap-1.5 min-h-[40px]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" /> Archived
                  </motion.span>
                )}
 
                {savedId && !savedId.startsWith('local-') && (
                    <motion.button
                    onClick={() => {
                      const url = `${window.location.origin}/share/${savedId}`;
                      navigator.clipboard.writeText(url);
                      toast("Share link copied to clipboard!", "copy");
                    }}
                    className="btn btn-outline border-teal/20 bg-teal/5 text-teal hover:bg-teal/10 h-11 px-4 rounded-md text-caption flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Share Journey
                  </motion.button>
                )}
 
                <div className="relative group">
                  <motion.button
                    className="btn btn-outline border-border bg-background text-muted hover:text-night h-11 px-4 rounded-md text-caption flex items-center gap-1 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Export Journal</span>
                  </motion.button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-border rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 py-1 font-mono text-meta uppercase">
                    <button
                      onClick={() => window.print()}
                      className="btn-ghost w-full text-left px-3 py-2 cursor-pointer block font-bold"
                    >
                      Print / PDF
                    </button>
                    <button
                      onClick={handleCopyItineraryText}
                      className="btn-ghost w-full text-left px-3 py-2 cursor-pointer block font-bold"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
 
                <motion.button
                  onClick={onReset}
                  className="btn btn-outline border-border bg-background text-muted hover:text-night h-11 px-4 rounded-md text-caption cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↺ New Journey
                </motion.button>
              </div>
            </div>
 
            {itineraryResult.recommendationReasoning && (
              <div className="border-t border-border/15 pt-4 mt-6">
                <p className="text-body text-muted/80 leading-relaxed font-light italic">
                  &ldquo;{itineraryResult.recommendationReasoning}&rdquo;
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. Story Timeline */}
        <motion.div className="space-y-6" variants={sectionVariants} custom={1}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-section text-night font-light lowercase">story timeline</h3>
            <div className="h-px flex-1 bg-border/20" />
          </div>
 
          {/* Day Tabs */}
           <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
             {itin.map((dayItem: any, idx: number) => {
               const isActive = activeDayTab === idx;
               return (
                 <motion.button
                   key={idx}
                   onClick={() => onActiveDayTabChange(idx)}
                   className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono font-bold tracking-wide transition-all duration-200 cursor-pointer outline-none select-none ${
                     isActive
                       ? 'bg-gold text-night border-gold shadow-md'
                       : 'bg-surface text-muted/70 border-border/40 hover:border-gold/50 hover:text-night hover:bg-background'
                   }`}
                   whileHover={{ y: -1 }}
                   whileTap={{ scale: 0.96 }}
                 >
                   <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isActive ? 'bg-night/20 text-night' : 'bg-secondary-surface text-muted/60'}`}>
                     {idx + 1}
                   </span>
                   <span className="uppercase tracking-widest text-[10px]">{isActive ? dayItem?.title?.split(' ').slice(0, 2).join(' ') || `Day ${idx + 1}` : `Day ${idx + 1}`}</span>
                 </motion.button>
               );
             })}
           </div>
 
          {/* Active Day timeline panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDayTab}
              className="bg-surface border border-border/70 rounded-2xl p-6 md:p-8 shadow-md space-y-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div>
                <span className="text-meta font-mono text-coral block mb-1">
                  chapter {activeDayTab + 1} of {itin.length}
                </span>
                <h3 className="font-display text-section text-night font-light lowercase">
                  {currentDay.title}
                </h3>
              </div>
 
              <p className="text-base text-night/85 leading-relaxed font-light">
                {currentDay.description}
              </p>
 
              {/* Highlights Row */}
              {(tour?.localSecret || tour?.photographySpot || tour?.signatureExperience) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Local Secret */}
                  {tour?.localSecret && (
                    <div className="bg-amber-50/20 border border-gold/15 rounded-md p-4 space-y-2 shadow-sm relative overflow-hidden group hover:border-gold/40 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-meta font-mono text-gold uppercase tracking-wider block font-bold">local secret</span>
                      </div>
                      <p className="text-body text-night/80 font-light leading-relaxed">{tour.localSecret}</p>
                    </div>
                  )}

                  {/* Photography Spot */}
                  {tour?.photographySpot && (
                    <div className="bg-rose-50/20 border border-coral/15 rounded-md p-4 space-y-2 shadow-sm relative overflow-hidden group hover:border-coral/40 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-coral/[0.02] to-transparent pointer-events-none" />
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-coral shrink-0" />
                        <span className="text-meta font-mono text-coral uppercase tracking-wider block font-bold">photography spot</span>
                      </div>
                      <p className="text-body text-night/80 font-light leading-relaxed">{tour.photographySpot}</p>
                    </div>
                  )}

                  {/* Signature Experience */}
                  {tour?.signatureExperience && (
                    <div className="bg-cyan-50/20 border border-teal/15 rounded-md p-4 space-y-2 shadow-sm relative overflow-hidden group hover:border-teal/40 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal/[0.02] to-transparent pointer-events-none" />
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal shrink-0" />
                        <span className="text-meta font-mono text-teal uppercase tracking-wider block font-bold">signature experience</span>
                      </div>
                      <p className="text-body text-night/80 font-light leading-relaxed">{tour.signatureExperience}</p>
                    </div>
                  )}
                </div>
              )}
              {/* Activity Stops — vertical timeline */}
               <div className="relative pl-8 mt-4 space-y-5">
                 {/* vertical line */}
                 <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />
                 {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => {
                   const timeLabels = ['Morning', 'Midday', 'Afternoon', 'Evening', 'Night'];
                   const timeColors = ['text-amber-600', 'text-gold', 'text-coral', 'text-teal', 'text-indigo-400'];
                   const dotColors = ['bg-amber-400', 'bg-gold', 'bg-coral', 'bg-teal', 'bg-indigo-400'];
                   const timeLabel = timeLabels[aIdx % timeLabels.length];
                   const timeColor = timeColors[aIdx % timeColors.length];
                   const dotColor = dotColors[aIdx % dotColors.length];
                   return (
                     <div key={aIdx} className="relative group text-left">
                       {/* Timeline dot */}
                       <div className={`absolute -left-[21px] top-3.5 w-3 h-3 rounded-full ${dotColor} border-2 border-surface shadow transition-all duration-300 group-hover:scale-125 z-10`} />
                       <div className="bg-background/60 hover:bg-white transition-all duration-300 p-4 rounded-lg border border-border/30 hover:border-border/80 hover:shadow-sm group">
                         <div className="flex items-center gap-2 mb-2">
                           <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${timeColor}`}>{timeLabel}</span>
                           <span className="h-px flex-1 bg-border/30" />
                           <span className="text-[10px] font-mono text-muted/40 uppercase">Stop {aIdx + 1}</span>
                         </div>
                         <p className="text-body text-night/90 font-medium leading-relaxed group-hover:text-night transition-colors">
                           {act}
                         </p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
 
        {/* 3. Route Map */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={2}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-section text-night font-light lowercase">route map</h3>
            <div className="h-px flex-1 bg-border/20" />
          </div>
          <div className="bg-surface border border-border/70 rounded-2xl overflow-hidden shadow-md h-44 w-full relative">
            <ItineraryMap days={itin} activeDay={activeDayTab} />
          </div>
        </motion.div>
 
        {/* 4. Hotels */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={3}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-section text-night font-light lowercase">where to stay</h3>
            <div className="h-px flex-1 bg-border/20" />
          </div>
          {getHotelsByDestination(destId).length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {getHotelsByDestination(destId).slice(0, 2).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-md bg-surface border border-border/70 shadow-sm text-center">
              <p className="text-body text-muted/80 font-light">Stay recommendations for this chapter are currently being hand-selected.</p>
            </div>
          )}
        </motion.div>

        {/* 5. Journey Metrics */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={4}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-night font-light lowercase">journey snapshot</h3>
            <div className="h-px flex-1 bg-border/65" />
          </div>
          <div className="bg-surface border border-border rounded-3xl p-5 md:p-6 shadow-card">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <span className="font-display text-3xl font-light text-coral leading-none block">
                  <AnimatedCounter value={itineraryResult.recommendationScore || 96} /><span className="text-xl">%</span>
                </span>
                <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/70 block mt-1">match score</span>
              </div>
              <div className="text-center border-l border-border/50 pl-4">
                <span className="font-display text-2xl font-light text-night leading-none block">₹{(costs.total / 1000).toFixed(0)}k</span>
                <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/70 block mt-1">est. total</span>
              </div>
              <div className="text-center border-l border-border/50 pl-4">
                <span className="font-display text-lg font-light text-gold leading-snug block">{(tour?.bestSeason || 'Oct – Mar').split(' to ')[0]}</span>
                <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/70 block mt-1">best season</span>
              </div>
              <div className="text-center border-l border-border/50 pl-4">
                <span className="font-display text-3xl font-light text-night leading-none block">{customDuration}</span>
                <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/70 block mt-1">day journey</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. Boarding Pass */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={5}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-night font-light lowercase">journey pass</h3>
            <div className="h-px flex-1 bg-border/65" />
          </div>
          <div className="bg-gradient-to-br from-white/95 to-[#FFFDF9]/65 border border-border/70 rounded-3xl relative overflow-hidden shadow-card text-night">
            {/* Punch Holes for Ticket Aesthetic */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-r-0 border-background z-20" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-l-0 border-background z-20" />

            {/* Ticket Header */}
            <div className="bg-[#F2ECE3] px-6 py-4 flex items-center justify-between border-b border-border/70">
              <div className="text-left">
                <span className="font-mono text-micro uppercase tracking-[0.3em] text-gold block">travebie.ai · atlas vivant</span>
                <span className="text-micro font-bold uppercase tracking-wider text-night">Journey Boarding Pass</span>
              </div>
              <div className="text-right">
                <span className="text-micro font-mono text-muted/75 block uppercase">Pass No.</span>
                <span className="text-micro font-mono font-bold text-gold">TB-{destId.slice(0,3).toUpperCase()}-{customDuration}D</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Journey Cities */}
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-micro font-mono uppercase tracking-wider text-muted/75 block">from</span>
                  <span className="font-display text-2xl font-light leading-none text-night">{fromLocation ? fromLocation.split(',')[0].slice(0,3).toUpperCase() : 'DEL'}</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-px flex-1 border-t border-dashed border-border" />
                  <Compass className="w-4 h-4 text-gold animate-spin-slow" />
                  <div className="h-px flex-1 border-t border-dashed border-border" />
                </div>
                <div className="text-right">
                  <span className="text-micro font-mono uppercase tracking-wider text-muted/75 block">to</span>
                  <span className="font-display text-2xl font-light text-gold leading-none">{getDestinationPrettyName(destId).slice(0,3).toUpperCase()}</span>
                </div>
              </div>

              {/* Dashed Line */}
              <div className="border-t border-dashed border-border w-full" />

              {/* Cost Breakdowns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-left">
                <div>
                  <span className="text-muted/75 font-light font-sans block text-micro lowercase">Transit & transfers</span>
                  <span className="font-semibold font-mono text-night text-sm">₹{costs.transit.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-muted/75 font-light font-sans block text-micro lowercase">Accommodations</span>
                  <span className="font-semibold font-mono text-night text-sm">₹{costs.stay.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-muted/75 font-light font-sans block text-micro lowercase">Food & experiences</span>
                  <span className="font-semibold font-mono text-night text-sm">₹{costs.food.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Cost distribution bar */}
              {(() => {
                const total = costs.transit + costs.stay + costs.food || 1;
                const transitPct = (costs.transit / total) * 100;
                const stayPct = (costs.stay / total) * 100;
                const foodPct = (costs.food / total) * 100;
                return (
                  <div className="space-y-1.5">
                    <div className="flex h-2 rounded-full overflow-hidden bg-border/40">
                      <motion.div className="bg-teal/70 h-full" initial={{ width: 0 }} animate={{ width: `${transitPct}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                      <motion.div className="bg-gold/70 h-full" initial={{ width: 0 }} animate={{ width: `${stayPct}%` }} transition={{ duration: 0.8, delay: 0.4 }} />
                      <motion.div className="bg-coral/70 h-full" initial={{ width: 0 }} animate={{ width: `${foodPct}%` }} transition={{ duration: 0.8, delay: 0.6 }} />
                    </div>
                    <div className="flex justify-between text-micro font-mono text-muted/75">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal/70 inline-block" />Transit</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />Stay</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-coral/70 inline-block" />Food</span>
                    </div>
                  </div>
                );
              })()}

              {/* Total / Tier */}
              <div className="border-t border-dashed border-border pt-4 flex justify-between items-end text-left">
                <div>
                  <span className="text-micro font-mono uppercase tracking-wider text-muted/75 block mb-1">estimated total cost</span>
                  <span className="font-display text-3xl font-light text-gold leading-none">₹{costs.total.toLocaleString('en-IN')}</span>
                </div>
                <span className="px-3 py-1 rounded bg-teal/10 text-teal text-micro font-bold uppercase tracking-wider border border-teal/20">
                  {derivedBudgetTier}
                </span>
              </div>

              {/* Barcode */}
              <div className="border-t border-dashed border-border pt-4 mt-2 flex flex-col items-center gap-1.5">
                <div className="w-full h-8 bg-white border border-border/30 flex items-center justify-center px-4 py-1.5 rounded opacity-85 hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-full h-5 text-night/60" fill="currentColor" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <rect x="0" y="0" width="2.5" height="20" /><rect x="4" y="0" width="1.2" height="20" />
                    <rect x="6" y="0" width="3.5" height="20" /><rect x="11" y="0" width="1.2" height="20" />
                    <rect x="13" y="0" width="2.5" height="20" /><rect x="17" y="0" width="4.5" height="20" />
                    <rect x="23" y="0" width="1.2" height="20" /><rect x="25" y="0" width="2.5" height="20" />
                    <rect x="29" y="0" width="1.2" height="20" /><rect x="31" y="0" width="3.5" height="20" />
                    <rect x="36" y="0" width="2.5" height="20" /><rect x="40" y="0" width="1.2" height="20" />
                    <rect x="42" y="0" width="4.5" height="20" /><rect x="48" y="0" width="2.5" height="20" />
                    <rect x="52" y="0" width="1.2" height="20" /><rect x="54" y="0" width="3.5" height="20" />
                    <rect x="59" y="0" width="1.2" height="20" /><rect x="61" y="0" width="2.5" height="20" />
                    <rect x="65" y="0" width="4.5" height="20" /><rect x="71" y="0" width="1.2" height="20" />
                    <rect x="73" y="0" width="2.5" height="20" /><rect x="77" y="0" width="1.2" height="20" />
                    <rect x="79" y="0" width="3.5" height="20" /><rect x="84" y="0" width="2.5" height="20" />
                    <rect x="88" y="0" width="1.2" height="20" /><rect x="90" y="0" width="4.5" height="20" />
                    <rect x="96" y="0" width="1.2" height="20" /><rect x="98" y="0" width="2.5" height="20" />
                  </svg>
                </div>
                <span className="font-mono text-micro tracking-[0.25em] text-muted/75 uppercase">TZ-{destId.slice(0,3).toUpperCase()}-{customBudgetAmount}-{customDuration}D</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}