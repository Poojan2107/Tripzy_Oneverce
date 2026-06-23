"use client";
import { Compass, Sun, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TOURS_DATA } from '../../data';
import { getAtmosphere } from '../../utils/atmosphere';
import { getHotelsByDestination } from '../../data/hotels';
import HotelCard from '../HotelCard';
import WaxSeal from './WaxSeal';

const ItineraryMap = dynamic(() => import('../map/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-52 rounded-2xl bg-[#0C2533] animate-pulse flex items-center justify-center border border-white/10">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Plotting Route Map...</span>
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

export default function PlannerResult({
  itineraryResult,
  customDuration,
  travelers,
  derivedBudgetTier,
  customBudgetAmount,
  fromLocation,
  selectedDestination,
  savedId,
  saving,
  activeDayTab,
  onActiveDayTabChange,
  onSave,
  onReset,
  getJourneyPersona,
  getDestinationPrettyName,
}: PlannerResultProps) {
  if (itineraryResult.error) {
    return (
      <div className="pt-28 pb-32 px-6 max-w-md mx-auto min-h-[100dvh] bg-[#081A24] flex items-center justify-center">
        <div className="text-center p-8 bg-[#0C2533] border border-white/10 rounded-3xl shadow-sm space-y-4 text-white">
          <Compass className="w-10 h-10 text-white/20 mx-auto" />
          <h2 className="font-display text-2xl font-light text-white lowercase">Journey Interrupted</h2>
          <p className="text-xs text-white/50 font-light leading-relaxed">{itineraryResult.error}</p>
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl bg-[#FDB62F] hover:bg-[#FDB62F]/90 text-navy text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
          >
            Try Again
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl border border-white/10 bg-[#081A24] text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer min-h-[44px]"
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
  const destId = itineraryResult.destinationId || selectedDestination || '';
  const tour = TOURS_DATA.find(t => t.id === destId);

  return (
    <div className="min-h-[100dvh] bg-[#081A24] text-white select-none text-left pt-6 pb-24">
      <div className="bg-[#0C2533] relative overflow-hidden border-b border-white/5 rounded-3xl max-w-7xl mx-auto mb-6 shadow-md">
        {tour?.bannerImage && (
          <div className="absolute inset-0 opacity-[0.15]">
            <img src={tour.bannerImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C2533] via-[#0C2533]/90 to-transparent" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-gold animate-spin-slow" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gold font-bold">tripzy.ai · atlas vivant</span>
                </div>
                <span className="h-px w-6 bg-white/20" />
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">{getJourneyPersona()}</span>
                {weather?.temperature && (
                  <>
                    <span className="h-px w-6 bg-white/20 hidden sm:inline" />
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                      <Sun className="w-3 h-3 text-gold" /> {weather.temperature} · {weather.conditions}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-display text-white font-light lowercase leading-none mt-2" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                your <em className="text-gold not-italic">{getDestinationPrettyName(destId).toLowerCase()}</em> journal
              </h1>
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-1">
                {customDuration} days · {itin.length} chapters · crafted for {travelers || 'the explorer'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {!savedId ? (
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-[#0B1720] text-[10px] font-bold uppercase tracking-wider hover:bg-gold/90 transition-all cursor-pointer disabled:opacity-50 shadow-md min-h-[44px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {saving ? 'Archiving...' : 'Save to Passport'}
                </button>
              ) : (
                <span className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/25 flex items-center gap-1.5 min-h-[44px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" /> Archived
                </span>
              )}
              <button
                onClick={onReset}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer min-h-[44px]"
              >
                ↺ New Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 mb-6">
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-card bg-[#0C2533] relative">
          <div className="flex flex-col md:flex-row relative z-10">
            <div className="relative w-full md:w-64 shrink-0 aspect-[16/9] md:aspect-auto min-h-[160px] overflow-hidden">
              {tour?.bannerImage ? (
                <>
                  <img src={tour.bannerImage} alt={getDestinationPrettyName(destId)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-white/20" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-2 text-left">
                <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">{tour?.chapterName || 'Chapter'} · {tour?.chapterTitle || getDestinationPrettyName(destId)}</span>
                <span className="font-display text-2xl text-white font-light lowercase leading-none block">{getDestinationPrettyName(destId).toLowerCase()}</span>
              </div>
              <WaxSeal text="TRIPZY APPROVED" subtext="ATLAS VIVANT" />
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between text-left">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="text-center">
                  <span className="font-display text-4xl font-light text-[#E6355A] leading-none block">{itineraryResult.recommendationScore || 96}<span className="text-2xl">%</span></span>
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-white/40 block mt-1.5">ai match score</span>
                </div>
                <div className="text-center border-l border-white/10">
                  <span className="font-display text-3xl font-light text-white leading-none block">₹{(costs.total / 1000).toFixed(0)}k</span>
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-white/40 block mt-1.5">est. total</span>
                </div>
                <div className="text-center border-l border-white/10">
                  <span className="font-display text-xl font-light text-gold leading-snug block">{(tour?.bestSeason || 'Oct – Mar').split(' to ')[0]}</span>
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-white/40 block mt-1.5">best season</span>
                </div>
                <div className="text-center border-l border-white/10">
                  <span className="font-display text-4xl font-light text-white leading-none block">{customDuration}</span>
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-white/40 block mt-1.5">day journey</span>
                </div>
              </div>

              {itineraryResult.recommendationReasoning && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] text-white/70 font-light leading-relaxed italic">
                    &ldquo;{itineraryResult.recommendationReasoning}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div id="itinerary-main-grid" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-4 space-y-5">
            <div className="bg-[#0C2533] border border-white/10 rounded-3xl overflow-hidden shadow-card">
              <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
                <div className="text-left">
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-white/40 block">route map</span>
                  <span className="font-display text-lg text-white font-light lowercase leading-none">{getDestinationPrettyName(destId)}</span>
                </div>
              </div>
              <div className="h-52 w-full">
                <ItineraryMap days={itin} activeDay={activeDayTab} />
              </div>
            </div>

            <div className="bg-[#0C2533] border border-white/10 rounded-3xl relative overflow-hidden shadow-card text-white">
              <div className="bg-[#081A24] px-5 py-4 flex items-center justify-between border-b border-white/5">
                <div className="text-left">
                  <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-gold block">tripzy.ai · atlas vivant</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Journey Boarding Pass</span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] font-mono text-white/40 block uppercase">Pass No.</span>
                  <span className="text-[10px] font-mono font-bold text-gold">TZ-{destId.slice(0,3).toUpperCase()}-{customDuration}D</span>
                </div>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-white/40 block">from</span>
                    <span className="font-display text-xl font-light leading-none text-white/95">{fromLocation ? fromLocation.split(',')[0].slice(0,3).toUpperCase() : 'DEL'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="h-px flex-1 border-t border-dashed border-white/20" />
                    <Compass className="w-3.5 h-3.5 text-gold animate-spin-slow" />
                    <div className="h-px flex-1 border-t border-dashed border-white/20" />
                  </div>
                  <div className="text-right">
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-white/40 block">to</span>
                    <span className="font-display text-xl font-light text-gold leading-none">{getDestinationPrettyName(destId).slice(0,3).toUpperCase()}</span>
                  </div>
                </div>

                <div className="relative my-3">
                  <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-6 bg-[#081A24] rounded-r-full border border-l-0 border-white/10 z-20" />
                  <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-3.5 h-6 bg-[#081A24] rounded-l-full border border-r-0 border-white/10 z-20" />
                  <div className="border-t-2 border-dashed border-white/15 w-full" />
                </div>

                <div className="space-y-2.5 text-xs text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-light font-sans">Transit & transfers</span>
                    <span className="font-semibold font-mono text-white/90">₹{costs.transit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-light font-sans">Accommodations</span>
                    <span className="font-semibold font-mono text-white/90">₹{costs.stay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-light font-sans">Food & experiences</span>
                    <span className="font-semibold font-mono text-white/90">₹{costs.food.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/15 pt-4 flex justify-between items-end text-left">
                  <div>
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-white/40 block mb-1">estimated total</span>
                    <span className="font-display text-3xl font-light text-white leading-none">₹{costs.total.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#148596]/15 text-[#148596] text-[9px] font-bold uppercase tracking-wider border border-[#148596]/30">
                    {derivedBudgetTier}
                  </span>
                </div>

                <div className="border-t border-dashed border-white/15 pt-4 mt-2 flex flex-col items-center gap-1.5">
                  <div className="w-full h-8 bg-white/5 flex items-center justify-center px-4 py-1.5 rounded opacity-75 hover:opacity-95 transition-opacity duration-300">
                    <svg className="w-full h-5 text-white/80" fill="currentColor" viewBox="0 0 100 20" preserveAspectRatio="none">
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
                  <span className="font-mono text-[7px] tracking-[0.25em] text-white/40 uppercase">TZ-{destId.slice(0,3).toUpperCase()}-{customBudgetAmount}-{customDuration}D</span>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {itin.map((dayItem: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => onActiveDayTabChange(idx)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer border relative overflow-hidden hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                    activeDayTab === idx
                      ? 'bg-[#FDB62F] text-[#0B1720] border-[#FDB62F] shadow-md font-bold'
                      : 'bg-[#0C2533] text-white/75 border-white/10 hover:border-[#FDB62F]'
                  }`}
                  style={{ minWidth: '64px' }}
                >
                  <span className="font-display text-xl font-light leading-none">{idx + 1}</span>
                  <span className="text-[7px] font-mono uppercase tracking-wider mt-1">day</span>
                </button>
              ))}
            </div>

            <div className="bg-[#0C2533] border border-white/10 rounded-3xl overflow-hidden shadow-card p-6 text-left">
              <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
                <div>
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.3em] text-[#E6355A] font-bold block mb-1">
                    chapter {activeDayTab + 1} of {itin.length}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-light text-white lowercase">
                    {currentDay.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-sans font-light">
                {currentDay.description}
              </p>

              <div className="mt-8 relative pl-6 border-l border-white/10 space-y-6">
                {currentDay.activities && currentDay.activities.map((act: string, aIdx: number) => (
                  <div key={aIdx} className="relative group text-left">
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-gold border border-[#0C2533] shadow-[0_0_8px_#FDB62F] transition-all duration-300 group-hover:scale-125" />
                    <div className="bg-[#081A24]/60 hover:bg-[#081A24] transition-all duration-300 p-4 rounded-2xl border border-white/5 hover:border-white/10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-gold font-bold">Stop {aIdx + 1}</span>
                        <span className="h-px w-3 bg-white/10" />
                        <span className="text-[8px] font-mono text-white/40 uppercase">Day {activeDayTab + 1} Log</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-sans font-light">{act}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="font-display text-xl text-white font-light lowercase">where to stay</h3>
              {getHotelsByDestination(destId).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getHotelsByDestination(destId).slice(0, 2).map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#081A24]/60 border border-white/5 text-center">
                  <p className="text-xs text-white/50 font-light font-sans">Stay recommendations for this chapter are currently being hand-selected.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
