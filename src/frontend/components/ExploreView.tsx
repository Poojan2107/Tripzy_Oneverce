"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Heart, MapPin, Calendar, Clock, Compass, X, Camera, Sparkles, Map, List, ArrowRight, Star, Zap } from 'lucide-react';
import { Tour } from '../types';
import { CATEGORY_CHIPS } from '../data';
import ScrollReveal from './ui/ScrollReveal';
import SafeImage from './ui/SafeImage';
import dynamic from 'next/dynamic';
import { formatINR } from '../utils/currency';

// Dynamically import the map to avoid Leaflet SSR issues in Next.js
const DiscoveryMap = dynamic(() => import('./map/DiscoveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-cream animate-pulse flex flex-col items-center justify-center">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/60">Loading Atlas Map...</span>
    </div>
  )
});

interface ExploreViewProps {
  tours: Tour[];
  onTourSelect: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
  wishlistIds: string[];
  initialCategoryFilter?: string;
  loading?: boolean;
}

// Quick tag colors per mood
const MOOD_COLORS: Record<string, string> = {
  'Spiritual': '#E07B39',
  'Adventure': '#B71C1C',
  'Nature': '#2E7D32',
  'Culture': '#6A1B9A',
  'Food': '#E65100',
  'Luxury': '#D6A85F',
  'Relaxation': '#0277BD',
  'Hidden': '#4A4A4A',
};

export default function ExploreView({
  tours,
  onTourSelect,
  onToggleWishlist,
  wishlistIds,
  initialCategoryFilter = 'all',
  loading = false,
}: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategoryFilter || 'all');
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  
  // Mobile layout state: 'list' or 'map'
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const filteredTours = useMemo(() => {
    let list = tours;
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(t =>
        t.moods.some(m => m.toLowerCase() === activeCategory.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tours, activeCategory, searchQuery]);

  const activeTour = useMemo(() => {
    return tours.find(t => t.id === activeTourId) || null;
  }, [tours, activeTourId]);

  // Desktop only: set first item active on mount for sidebar highlight
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && filteredTours.length > 0 && !activeTourId) {
      setActiveTourId(filteredTours[0].id);
    }
  }, []);

  const accentPrimary = activeTour?.accents?.primary || '#D6A85F';
  const accentSecondary = activeTour?.accents?.secondary || '#0F172A';

  return (
    <div 
      className="h-[calc(100dvh-76px)] min-h-0 bg-[#081A24] flex flex-col md:flex-row select-none relative overflow-hidden text-white"
      style={{
        ['--color-accent-primary' as any]: accentPrimary,
        ['--color-accent-secondary' as any]: accentSecondary,
      }}
    >
      {/* ── MOBILE VIEW TOGGLE BAR ── */}
      <div className={`md:hidden fixed bottom-[calc(68px+env(safe-area-inset-bottom,8px))] left-1/2 -translate-x-1/2 z-[60] bg-[#0C2533]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-lg gap-3 text-xs font-mono uppercase tracking-wider border border-white/10 ${activeTour && mobileView === 'list' ? 'hidden' : 'flex'}`}>
        <button 
          onClick={() => setMobileView('list')}
          className={`flex items-center gap-1.5 min-h-[44px] min-w-[52px] justify-center rounded-full px-3 transition-all ${mobileView === 'list' ? 'bg-white/10 text-gold font-bold' : 'opacity-60 hover:opacity-100'}`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button 
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 min-h-[44px] min-w-[52px] justify-center rounded-full px-3 transition-all ${mobileView === 'map' ? 'bg-white/10 text-gold font-bold' : 'opacity-60 hover:opacity-100'}`}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* ── LEFT SIDEBAR PANEL (35% on Desktop) ── */}
      <div className={`w-full md:w-[36%] flex flex-col border-r border-white/5 bg-[#0C2533] h-full overflow-hidden shrink-0 ${
        mobileView === 'list' ? 'block' : 'hidden md:flex'
      }`}>
        {/* Search and Filters Header */}
        <div className="p-5 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-light text-white lowercase tracking-tight">
                explore <span className="font-display italic text-gold">atlas</span>
              </h1>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-0.5">
                India's living cartography
              </p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-light text-gold">{filteredTours.length}</span>
              <p className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Chapters</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#081A24] border border-white/10 focus-within:border-gold transition-colors">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, regions, moods..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-base text-white placeholder:text-white/30 outline-none w-full font-sans font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0 w-11 h-11 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-white/40 hover:text-white" />
              </button>
            )}
          </div>

          {/* Scrollable category chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => {
                  setActiveCategory(chip.id);
                  setActiveTourId(null);
                }}
                className={`flex-shrink-0 px-3 py-2.5 rounded-full text-[8px] font-mono uppercase tracking-wider transition-all duration-300 border min-h-[44px] flex items-center ${
                  activeCategory === chip.id
                    ? 'bg-[#148596] text-white border-[#148596]'
                    : 'bg-[#081A24] text-white/70 border-white/10 hover:border-gold'
                }`}
              >
                {chip.label.replace(' India', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
          {loading ? (
            Array(5).fill(null).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#081A24] animate-pulse border border-white/5" />
            ))
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Compass className="w-8 h-8 text-white/20 mx-auto" />
              <p className="font-display italic text-lg text-white/40">no destinations match</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-[9px] font-mono uppercase tracking-wider text-gold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTours.map((tour, idx) => {
              const isActive = tour.id === activeTourId;
              const moodColor = MOOD_COLORS[tour.moods?.[0]] || '#FDB62F';
              return (
                <div
                  key={tour.id}
                  onClick={() => setActiveTourId(tour.id)}
                  className={`group p-0 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-[#081A24] border-[#148596] shadow-[0_0_15px_rgba(20,133,150,0.12)]'
                      : 'bg-[#081A24]/60 border-white/5 hover:bg-[#081A24] hover:border-white/10 hover:shadow-soft'
                  }`}
                >
                  <div className="flex gap-0">
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 overflow-hidden bg-cream rounded-l-2xl relative">
                      <SafeImage 
                        src={tour.bannerImage} 
                        alt={tour.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">
                          <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                          <span>{tour.duration.split(',')[0]}</span>
                        </div>
                        <h3 className="font-display text-xl text-white leading-none font-light lowercase truncate">
                          {tour.title}
                        </h3>
                        <p className="text-[10px] text-white/50 font-light truncate mt-0.5">
                          {tour.location.split(',')[0]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-bold text-white font-mono">{formatINR(tour.price)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold text-gold" />
                            <span className="text-[9px] font-bold text-white/80">{parseFloat(tour.rating.toFixed(1))}</span>
                          </div>
                          <span 
                            className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                            style={{ backgroundColor: moodColor }}
                          >
                            {tour.moods?.[0]}
                          </span>
                        </div>
                      </div>
                    </div>
 
                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-1 self-stretch rounded-r-2xl shrink-0 bg-gradient-to-b from-[#148596] to-[#FDB62F]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT MAP PANEL (64% on Desktop) ── */}
      <div className={`flex-1 h-full relative ${
        mobileView === 'map' ? 'block' : 'hidden md:block'
      }`}>
        <DiscoveryMap
          tours={tours}
          activeTourId={activeTourId}
          onActiveTourChange={setActiveTourId}
          onSelectTour={onTourSelect}
        />

        {/* ── STATS RIBBON (Bottom of map container) ── */}
        <div className="absolute bottom-6 left-6 right-6 z-20 bg-gradient-to-r from-[#0C2533]/90 to-[#081A24]/90 backdrop-blur-md rounded-[24px] border border-[#148596]/20 p-4.5 hidden md:flex justify-around items-center text-center shadow-[0_12px_36px_rgba(7,19,26,0.6)]">
          <div className="group cursor-default">
            <span className="font-display text-2.5xl font-light text-white block group-hover:text-gold transition-colors duration-300">87+</span>
            <span className="text-[8.5px] font-mono text-[#8FA0AB] uppercase tracking-widest mt-0.5">Destinations</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="group cursor-default">
            <span className="font-display text-2.5xl font-light text-white block group-hover:text-gold transition-colors duration-300">250+</span>
            <span className="text-[8.5px] font-mono text-[#8FA0AB] uppercase tracking-widest mt-0.5">Chapters</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="group cursor-default">
            <span className="font-display text-2.5xl font-light text-white block group-hover:text-gold transition-colors duration-300">1200+</span>
            <span className="text-[8.5px] font-mono text-[#8FA0AB] uppercase tracking-widest mt-0.5">Stories</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="group cursor-default">
            <span className="font-display text-2.5xl font-light text-white block group-hover:text-gold transition-colors duration-300">15K+</span>
            <span className="text-[8.5px] font-mono text-[#8FA0AB] uppercase tracking-widest mt-0.5">Explorers</span>
          </div>
        </div>
      </div>

      {/* ── SLIDE-OUT DRAWER OVERLAY ── */}
      {activeTour && (mobileView === 'list' || typeof window !== 'undefined' && window.innerWidth >= 768) && (
        <>
          {/* Backdrop (mobile only) */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setActiveTourId(null)} />
          <div className="fixed bottom-0 md:absolute inset-x-0 md:inset-auto md:top-4 md:bottom-4 md:right-4 md:w-[400px] bg-[#0C2533] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-elevated z-50 overflow-hidden flex flex-col animate-page-enter md:animate-none max-h-[75dvh] md:max-h-none pb-[env(safe-area-inset-bottom,0px)] text-white">
            {/* Drag handle for mobile */}
            <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>
            
            {/* Header image */}
            <div className="relative aspect-[16/9] md:aspect-[16/9] bg-cream shrink-0 overflow-hidden">
              <SafeImage src={activeTour.bannerImage} alt={activeTour.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              
              <button 
                onClick={() => setActiveTourId(null)}
                className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#081A24]/90 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 shadow-sm cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleWishlist(activeTour.id)}
                className="absolute top-3 right-16 w-11 h-11 rounded-full bg-[#081A24]/90 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 shadow-sm cursor-pointer z-10"
              >
                <Heart className={`w-4 h-4 ${wishlistIds.includes(activeTour.id) ? 'fill-rose-500 text-rose-500' : 'text-white/40'}`} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1.5">
                  {activeTour.chapterName || 'Featured Chapter'} · {activeTour.chapterTitle || 'India'}
                </span>
                <h2 className="font-display text-3xl text-white font-light lowercase leading-none">
                  {activeTour.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[9px] font-mono text-white/80">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    {parseFloat(activeTour.rating.toFixed(1))} ({activeTour.reviewsCount} reviews)
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[9px] font-mono text-white/80">{activeTour.duration}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[9px] font-mono text-white/80">{activeTour.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto scrollbar-thin text-left bg-[#0C2533]">
              {/* Mood tags + location */}
              <div className="px-5 pt-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-coral uppercase tracking-wider mb-2 font-bold">
                  <MapPin className="w-3 h-3" />
                  {activeTour.location}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTour.moods?.map(m => (
                    <span 
                      key={m} 
                      className="text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: MOOD_COLORS[m] || '#148596' }}
                    >
                      {m}
                    </span>
                  ))}
                  {activeTour.tags?.filter(t => !activeTour.moods?.includes(t)).slice(0, 2).map(t => (
                    <span key={t} className="text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Story */}
                <div className="space-y-1">
                  <h3 className="font-display text-xl text-white font-light lowercase">
                    {activeTour.storyHeadline || activeTour.subtitle}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-light font-sans">
                    {activeTour.storyNarrative || activeTour.description}
                  </p>
                </div>

                <div className="h-px bg-white/5" />

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#081A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block mb-1">Best Season</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-coral" />
                      {activeTour.bestSeason || 'Oct to Mar'}
                    </span>
                  </div>
                  <div className="bg-[#081A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block mb-1">Budget Index</span>
                    <span className="text-xs font-bold text-white">{activeTour.budgetRange || '₹30k-80k'}</span>
                  </div>
                  <div className="bg-[#081A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block mb-1">Price / Day</span>
                    <span className="text-xs font-bold text-white">{formatINR(activeTour.price)}</span>
                  </div>
                  <div className="bg-[#081A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block mb-1">Group Size</span>
                    <span className="text-xs font-bold text-white">{activeTour.groupSize}</span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Secret and Spot */}
                <div className="space-y-3">
                  {activeTour.localSecret && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block leading-none mb-1">local secret</span>
                        <p className="text-xs text-white font-light leading-relaxed font-sans">{activeTour.localSecret}</p>
                      </div>
                    </div>
                  )}

                  {activeTour.photographySpot && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block leading-none mb-1">photography spot</span>
                        <p className="text-xs text-white font-light leading-relaxed font-sans">{activeTour.photographySpot}</p>
                      </div>
                    </div>
                  )}

                  {activeTour.signatureExperience && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block leading-none mb-1">signature experience</span>
                        <p className="text-xs text-white font-light leading-relaxed font-sans">{activeTour.signatureExperience}</p>
                      </div>
                    </div>
                  )}
                </div>

                {activeTour.highlights && activeTour.highlights.length > 0 && (
                  <>
                    <div className="h-px bg-white/5" />
                    <div className="space-y-2.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">top highlights</span>
                      <ul className="space-y-1.5">
                        {activeTour.highlights.slice(0, 4).map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/80 font-light font-sans">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-coral" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/5 bg-[#0C2533] flex gap-2.5 shrink-0 pb-[max(12px,env(safe-area-inset-bottom,8px))]">
              <button
                onClick={() => setActiveTourId(null)}
                className="md:hidden px-5 py-3.5 rounded-xl border border-white/10 bg-[#081A24] text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer min-w-[80px]"
              >
                Close
              </button>
              <button
                onClick={() => onTourSelect(activeTour)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FDB62F] hover:bg-[#FDB62F]/90 text-[#0B1720] text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm min-h-[48px]"
              >
                <span>Explore Chapter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
