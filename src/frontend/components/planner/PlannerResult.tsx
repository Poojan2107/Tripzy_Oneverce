"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TOURS_DATA } from '../../data';
import { getHotelsByDestination } from '../../data/hotels';
import HotelCard from '../HotelCard';
import Footer from '../Footer';


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
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(value / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(start);
    }, duration / (value / step));
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
      alert("Journal itinerary copied as text to clipboard!");
    } catch (e) {
      console.error(e);
      alert("Failed to copy itinerary text.");
    }
  };

  if (itineraryResult.error) {
    return (
      <div className="pt-28 pb-32 px-6 max-w-md mx-auto min-h-[100dvh] bg-background flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-white border border-border/50 rounded-3xl shadow-sm space-y-4 text-night"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <Compass className="w-10 h-10 text-muted/30 mx-auto" />
          <h2 className="font-display text-2xl font-light text-night lowercase">journey interrupted</h2>
          <p className="text-small text-muted/60 font-light leading-relaxed">
            We're consulting our explorer archive and preparing an alternative journey.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <motion.button
              onClick={onReset}
              className="w-full px-6 py-2.5 rounded-xl bg-gold hover:bg-gold/90 text-night text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px] border-none"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Retry Action
            </motion.button>
            <motion.button
              onClick={onReset}
              className="w-full px-6 py-2.5 rounded-xl border border-border/40 bg-background text-xs font-bold uppercase tracking-wider text-muted/70 hover:text-night transition-colors cursor-pointer min-h-[44px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Over
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const itin = itineraryResult.itinerary || [];
  const costs = itineraryResult.costs || { transit: 0, stay: 0, food: 0, total: 0 };
  const currentDay = itin[activeDayTab] || {};
  const destId = itineraryResult.destinationId || selectedDestination || '';
  const tour = TOURS_DATA.find(t => t.id === destId);

  return (
    <motion.div
      className="min-h-[100dvh] bg-background text-night select-none text-left pt-6 pb-24"
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
    >
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* 1. Journey Hero */}
        <motion.div className="bg-surface relative overflow-hidden border border-border rounded-3xl shadow-card" variants={sectionVariants} custom={0}>
          {tour?.bannerImage && (
            <div className="absolute inset-0 opacity-[0.08]">
              <img src={tour.bannerImage} alt="" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent" />
            </div>
          )}
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-border/60">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-gold animate-spin-slow" />
                  <span className="font-mono text-micro uppercase tracking-[0.3em] text-gold font-bold">travebie.ai · companion journal</span>
                </div>
                <h1 className="font-display text-night font-light lowercase leading-none mt-1" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                  your <em className="text-gold not-italic">{getDestinationPrettyName(destId).toLowerCase()}</em> odyssey
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-background border border-border text-micro font-mono font-bold uppercase tracking-wider text-night">{customDuration} Days</span>
                  <span className="px-2.5 py-1 rounded-full bg-background border border-border text-micro font-mono font-bold uppercase tracking-wider text-night">{itin.length} Chapters</span>
                  {itineraryResult.recommendationScore && (
                    <span className="px-2.5 py-1 rounded-full bg-coral/10 border border-coral/20 text-micro font-mono font-bold uppercase tracking-wider text-coral">{itineraryResult.recommendationScore}% Match</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-micro font-mono font-bold uppercase tracking-wider text-teal">Crafted For {travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : travelers === 'friends' ? 'Group' : 'Explorer'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
                {!savedId ? (
                  <motion.button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-night text-micro font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 shadow-lg min-h-[46px] border-none hover:bg-gold/90"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {saving ? 'Archiving...' : 'Save to Passport'}
                  </motion.button>
                ) : (
                  <motion.span
                    className="px-5 py-3 rounded-xl bg-secondary-surface text-muted text-micro font-bold uppercase tracking-wider border border-border flex items-center gap-1.5 min-h-[46px]"
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
                      alert("Shareable Journey link copied to clipboard:\n" + url);
                    }}
                    className="px-4 py-3 rounded-xl border border-teal/20 bg-teal/10 hover:bg-teal/20 text-teal text-micro font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Share Journey
                  </motion.button>
                )}

                <div className="relative group">
                  <motion.button
                    className="px-4 py-3 rounded-xl border border-border bg-background text-micro font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-surface transition-colors cursor-pointer min-h-[44px] flex items-center gap-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Export Journal</span>
                  </motion.button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-border rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 py-1 font-mono text-micro uppercase tracking-wider">
                    <button
                      onClick={() => window.print()}
                      className="w-full text-left px-3 py-2 hover:bg-background text-night transition-colors cursor-pointer block border-none bg-transparent font-bold"
                    >
                      Print / PDF
                    </button>
                    <button
                      onClick={handleCopyItineraryText}
                      className="w-full text-left px-3 py-2 hover:bg-background text-night transition-colors cursor-pointer block border-none bg-transparent font-bold"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={onReset}
                  className="px-4 py-3 rounded-xl border border-border bg-background text-micro font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-surface transition-colors cursor-pointer min-h-[44px]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↺ New Journey
                </motion.button>
              </div>
            </div>

            {itineraryResult.recommendationReasoning && (
              <div className="border-t border-border/50 pt-4 mt-6">
                <p className="text-small text-muted leading-relaxed font-light italic">
                  &ldquo;{itineraryResult.recommendationReasoning}&rdquo;
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. Story Timeline */}
        <motion.div className="space-y-6" variants={sectionVariants} custom={1}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-night font-light lowercase">story timeline</h3>
            <div className="h-px flex-1 bg-border/65" />
          </div>

          {/* Day Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itin.map((dayItem: any, idx: number) => (
              <motion.button
                key={idx}
                onClick={() => onActiveDayTabChange(idx)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl transition-colors duration-300 cursor-pointer border relative overflow-hidden outline-none ${
                  activeDayTab === idx
                    ? 'bg-gold text-night border-gold shadow-md font-bold'
                    : 'bg-surface text-muted border-border hover:border-gold'
                }`}
                style={{ minWidth: '64px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-display text-lg font-light leading-none">{idx + 1}</span>
                <span className="text-micro font-mono uppercase tracking-wider mt-0.5">day</span>
              </motion.button>
            ))}
          </div>

          {/* Active Day timeline panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDayTab}
              className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-card space-y-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div>
                <span className="text-micro font-mono uppercase tracking-[0.3em] text-coral font-bold block mb-1">
                  chapter {activeDayTab + 1} of {itin.length}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-night lowercase">
                  {currentDay.title}
                </h3>
              </div>

              <p className="text-small text-muted leading-relaxed font-sans font-light">
                {currentDay.description}
              </p>

              {/* Local Secret */}
              {tour?.localSecret && (
                <div className="bg-background/60 border border-border/50 rounded-2xl p-4 space-y-1">
                  <span className="font-mono text-micro uppercase tracking-wider text-coral font-bold block">local secret</span>
                  <p className="text-small text-night/85 leading-relaxed font-sans font-light">{tour.localSecret}</p>
                </div>
              )}

              {/* Photography Spot */}
              {tour?.photographySpot && (
                <div className="bg-background/60 border border-border/50 rounded-2xl p-4 space-y-1">
                  <span className="font-mono text-micro uppercase tracking-wider text-gold font-bold block">photography spot</span>
                  <p className="text-small text-night/85 leading-relaxed font-sans font-light">{tour.photographySpot}</p>
                </div>
              )}

              {/* Signature Experience */}
              {tour?.signatureExperience && (
                <div className="bg-background/60 border border-border/50 rounded-2xl p-4 space-y-1">
                  <span className="font-mono text-micro uppercase tracking-wider text-teal font-bold block">signature experience</span>
                  <p className="text-small text-night/85 leading-relaxed font-sans font-light">{tour.signatureExperience}</p>
                </div>
              )}

              {/* Vertical progression line stops */}
              <div className="relative pl-6 border-l border-border mt-6 space-y-6">
                {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => (
                  <div key={aIdx} className="relative group text-left">
                    {/* Indicator Dot */}
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-gold border border-surface shadow-[0_0_8px_rgba(244,182,61,0.4)] transition-all duration-300 group-hover:scale-125" />

                    <div className="bg-background/40 hover:bg-surface transition-all duration-300 p-4 rounded-2xl border border-border/50 hover:border-border hover:shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-micro uppercase tracking-wider text-gold font-bold">explorer log</span>
                        <span className="h-px w-3 bg-border/40" />
                        <span className="text-micro font-mono text-muted/40 uppercase">stop {aIdx + 1}</span>
                      </div>
                      <p className="text-small text-night/95 leading-relaxed font-sans font-light">{act}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 3. Route Map */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={2}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-night font-light lowercase">route map</h3>
            <div className="h-px flex-1 bg-border/65" />
          </div>
          <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-card h-44 w-full relative">
            <ItineraryMap days={itin} activeDay={activeDayTab} />
          </div>
        </motion.div>

        {/* 4. Hotels */}
        <motion.div className="space-y-4" variants={sectionVariants} custom={3}>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-night font-light lowercase">where to stay</h3>
            <div className="h-px flex-1 bg-border/65" />
          </div>
          {getHotelsByDestination(destId).length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {getHotelsByDestination(destId).slice(0, 2).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface border border-border text-center">
              <p className="text-small text-muted font-light font-sans">Stay recommendations for this chapter are currently being hand-selected.</p>
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
          <div className="bg-dark-bg border border-dark-card rounded-3xl relative overflow-hidden shadow-card text-dark-text">
            {/* Punch Holes for Ticket Aesthetic */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-r-0 border-border z-20" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-l-0 border-border z-20" />

            {/* Ticket Header */}
            <div className="bg-dark-surface px-6 py-4 flex items-center justify-between border-b border-dark-card">
              <div className="text-left">
                <span className="font-mono text-micro uppercase tracking-[0.3em] text-gold block">travebie.ai · atlas vivant</span>
                <span className="text-micro font-bold uppercase tracking-wider text-dark-text">Journey Boarding Pass</span>
              </div>
              <div className="text-right">
                <span className="text-micro font-mono text-dark-muted block uppercase">Pass No.</span>
                <span className="text-micro font-mono font-bold text-gold">TB-{destId.slice(0,3).toUpperCase()}-{customDuration}D</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Journey Cities */}
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-micro font-mono uppercase tracking-wider text-dark-muted block">from</span>
                  <span className="font-display text-2xl font-light leading-none text-dark-text">{fromLocation ? fromLocation.split(',')[0].slice(0,3).toUpperCase() : 'DEL'}</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-px flex-1 border-t border-dashed border-dark-card" />
                  <Compass className="w-4 h-4 text-gold animate-spin-slow" />
                  <div className="h-px flex-1 border-t border-dashed border-dark-card" />
                </div>
                <div className="text-right">
                  <span className="text-micro font-mono uppercase tracking-wider text-dark-muted block">to</span>
                  <span className="font-display text-2xl font-light text-gold leading-none">{getDestinationPrettyName(destId).slice(0,3).toUpperCase()}</span>
                </div>
              </div>

              {/* Dashed Line */}
              <div className="border-t border-dashed border-dark-card w-full" />

              {/* Cost Breakdowns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-left">
                <div>
                  <span className="text-dark-muted font-light font-sans block text-micro lowercase">Transit & transfers</span>
                  <span className="font-semibold font-mono text-dark-text text-sm">₹{costs.transit.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-dark-muted font-light font-sans block text-micro lowercase">Accommodations</span>
                  <span className="font-semibold font-mono text-dark-text text-sm">₹{costs.stay.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-dark-muted font-light font-sans block text-micro lowercase">Food & experiences</span>
                  <span className="font-semibold font-mono text-dark-text text-sm">₹{costs.food.toLocaleString('en-IN')}</span>
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
                    <div className="flex h-2 rounded-full overflow-hidden bg-dark-card">
                      <motion.div className="bg-teal/70 h-full" initial={{ width: 0 }} animate={{ width: `${transitPct}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                      <motion.div className="bg-gold/70 h-full" initial={{ width: 0 }} animate={{ width: `${stayPct}%` }} transition={{ duration: 0.8, delay: 0.4 }} />
                      <motion.div className="bg-coral/70 h-full" initial={{ width: 0 }} animate={{ width: `${foodPct}%` }} transition={{ duration: 0.8, delay: 0.6 }} />
                    </div>
                    <div className="flex justify-between text-micro font-mono text-dark-muted">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal/70 inline-block" />Transit</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />Stay</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-coral/70 inline-block" />Food</span>
                    </div>
                  </div>
                );
              })()}

              {/* Total / Tier */}
              <div className="border-t border-dashed border-dark-card pt-4 flex justify-between items-end text-left">
                <div>
                  <span className="text-micro font-mono uppercase tracking-wider text-dark-muted block mb-1">estimated total cost</span>
                  <span className="font-display text-3xl font-light text-gold leading-none">₹{costs.total.toLocaleString('en-IN')}</span>
                </div>
                <span className="px-3 py-1 rounded bg-teal/10 text-teal text-micro font-bold uppercase tracking-wider border border-teal/20">
                  {derivedBudgetTier}
                </span>
              </div>

              {/* Barcode */}
              <div className="border-t border-dashed border-dark-card pt-4 mt-2 flex flex-col items-center gap-1.5">
                <div className="w-full h-8 bg-dark-surface flex items-center justify-center px-4 py-1.5 rounded opacity-75 hover:opacity-95 transition-opacity duration-300">
                  <svg className="w-full h-5 text-gold/60" fill="currentColor" viewBox="0 0 100 20" preserveAspectRatio="none">
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
                <span className="font-mono text-micro tracking-[0.25em] text-dark-muted uppercase">TZ-{destId.slice(0,3).toUpperCase()}-{customBudgetAmount}-{customDuration}D</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </motion.div>
  );
}