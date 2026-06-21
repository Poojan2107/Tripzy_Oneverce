"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Heart, MapPin, Calendar, Clock, Compass, X, Camera, Sparkles, Map, List, ArrowRight, Star, ChevronRight, Zap, Globe } from 'lucide-react';
import { Tour } from '../types';
import { CATEGORY_CHIPS } from '../data';
import ScrollReveal from './ui/ScrollReveal';
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

  // Set the first item as active by default if not set
  useEffect(() => {
    if (filteredTours.length > 0 && !activeTourId) {
      setActiveTourId(filteredTours[0].id);
    }
  }, [filteredTours, activeTourId]);

  const accentPrimary = activeTour?.accents?.primary || '#D6A85F';
  const accentSecondary = activeTour?.accents?.secondary || '#0F172A';

  return (
    <div 
      className="h-[calc(100vh-76px)] min-h-0 bg-sand flex flex-col md:flex-row select-none relative overflow-hidden"
      style={{
        ['--color-accent-primary' as any]: accentPrimary,
        ['--color-accent-secondary' as any]: accentSecondary,
      }}
    >
      {/* ── MOBILE VIEW TOGGLE BAR ── */}
      <div className="md:hidden fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,8px))] left-1/2 -translate-x-1/2 z-[60] bg-night text-white px-5 py-3 rounded-full shadow-lg flex gap-4 text-xs font-mono uppercase tracking-wider">
        <button 
          onClick={() => setMobileView('list')}
          className={`flex items-center gap-1.5 min-h-[44px] min-w-[44px] justify-center ${mobileView === 'list' ? 'text-gold font-bold' : 'opacity-70'}`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <div className="w-px h-6 bg-white/20 self-center" />
        <button 
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 min-h-[44px] min-w-[44px] justify-center ${mobileView === 'map' ? 'text-gold font-bold' : 'opacity-70'}`}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* ── LEFT SIDEBAR PANEL (35% on Desktop) ── */}
      <div className={`w-full md:w-[36%] flex flex-col border-r border-warm-gray bg-warm-white h-full overflow-hidden shrink-0 ${
        mobileView === 'list' ? 'block' : 'hidden md:flex'
      }`}>
        {/* Search and Filters Header */}
        <div className="p-5 border-b border-warm-gray space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-light text-night lowercase tracking-tight">
                explore <span className="font-display italic text-gold">atlas</span>
              </h1>
              <p className="text-[10px] font-mono text-muted/50 uppercase tracking-widest mt-0.5">
                India's living cartography
              </p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-light text-night">{filteredTours.length}</span>
              <p className="font-mono text-[8px] text-muted/60 uppercase tracking-widest">Chapters</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sand border border-warm-gray focus-within:border-gold transition-colors">
            <Search className="w-4 h-4 text-muted/40 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, regions, moods..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-base text-night placeholder:text-muted/30 outline-none w-full font-sans font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0 p-2">
                <X className="w-3.5 h-3.5 text-muted/45 hover:text-night" />
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
                  setActiveTourId(null); // Reset active selection
                }}
                className={`flex-shrink-0 px-3 py-2.5 rounded-full text-[8px] font-mono uppercase tracking-wider transition-all duration-300 border min-h-[44px] flex items-center ${
                  activeCategory === chip.id
                    ? 'bg-night text-white border-night'
                    : 'bg-white text-muted/70 border-warm-gray hover:border-gold'
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
              <div key={i} className="h-24 rounded-2xl bg-cream animate-pulse" />
            ))
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Compass className="w-8 h-8 text-muted/20 mx-auto" />
              <p className="font-display italic text-lg text-muted/50">no destinations match</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-[9px] font-mono uppercase tracking-wider text-saffron hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTours.map((tour, idx) => {
              const isActive = tour.id === activeTourId;
              const moodColor = MOOD_COLORS[tour.moods?.[0]] || '#D6A85F';
              return (
                <div
                  key={tour.id}
                  onClick={() => {
                    setActiveTourId(tour.id);
                  }}
                  className={`group p-0 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-white border-gold shadow-card'
                      : 'bg-white/60 border-warm-gray/60 hover:bg-white hover:border-warm-gray hover:shadow-soft'
                  }`}
                >
                  <div className="flex gap-0">
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 overflow-hidden bg-cream rounded-l-2xl">
                      <img 
                        src={tour.bannerImage} 
                        alt={tour.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                        decoding="async"
                        onError={e => { e.currentTarget.style.opacity = '0' }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-muted/50 uppercase tracking-widest mb-1">
                          <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                          <span>{tour.duration.split(',')[0]}</span>
                        </div>
                        <h3 className="font-display text-xl text-night leading-none font-light lowercase truncate">
                          {tour.title}
                        </h3>
                        <p className="text-[10px] text-muted/60 font-light truncate mt-0.5">
                          {tour.location.split(',')[0]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-bold text-night">{formatINR(tour.price)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold text-gold" />
                            <span className="text-[9px] font-bold text-muted">{parseFloat(tour.rating.toFixed(1))}</span>
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
                      <div className="w-1 self-stretch rounded-r-2xl shrink-0" style={{ backgroundColor: moodColor }} />
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

      </div>

        {/* ── SLIDE-OUT DRAWER OVERLAY ── */}
        {activeTour && (
          <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setActiveTourId(null)} />
          <div className="fixed bottom-0 md:absolute inset-x-0 md:inset-auto md:top-4 md:bottom-4 md:right-4 md:w-[400px] bg-white border border-warm-gray rounded-t-3xl md:rounded-3xl shadow-elevated z-50 overflow-hidden flex flex-col animate-page-enter md:animate-none max-h-[85dvh] md:max-h-none pb-[env(safe-area-inset-bottom,0px)]">
            {/* Drag handle for mobile */}
            <div className="md:hidden flex justify-center pt-2 pb-0 shrink-0">
              <div className="w-8 h-1 rounded-full bg-warm-gray" />
            </div>
            {/* Dynamic accent top strip */}
            <div className="h-1 w-full shrink-0 hidden md:block" style={{ background: `linear-gradient(90deg, ${activeTour.accents?.primary || '#D6A85F'}, ${activeTour.accents?.secondary || '#0F172A'})` }} />
            
            {/* Header image */}
            <div className="relative aspect-[16/9] bg-cream shrink-0 overflow-hidden">
              <img src={activeTour.bannerImage} alt={activeTour.title} className="w-full h-full object-cover bg-cream transition-transform duration-700 hover:scale-105" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              <button 
                onClick={() => setActiveTourId(null)}
                className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-warm-gray flex items-center justify-center text-night hover:bg-white shadow-sm cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleWishlist(activeTour.id)}
                className="absolute top-3 right-16 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-warm-gray flex items-center justify-center text-night hover:bg-white shadow-sm cursor-pointer z-10"
              >
                <Heart className={`w-4 h-4 ${wishlistIds.includes(activeTour.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1.5">
                  {activeTour.chapterName || 'Featured Chapter'} · {activeTour.chapterTitle || 'India'}
                </span>
                <h2 className="font-display text-3xl text-white font-light lowercase leading-none">
                  {activeTour.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[9px] font-mono text-white/70">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    {parseFloat(activeTour.rating.toFixed(1))} ({activeTour.reviewsCount} reviews)
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-[9px] font-mono text-white/70">{activeTour.duration}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-[9px] font-mono text-white/70">{activeTour.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto scrollbar-thin text-left">
              
              {/* Mood tags + location */}
              <div className="px-5 pt-4 pb-3 border-b border-warm-gray/40">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-saffron uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3" />
                  {activeTour.location}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTour.moods?.map(m => (
                    <span 
                      key={m} 
                      className="text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: MOOD_COLORS[m] || '#D6A85F' }}
                    >
                      {m}
                    </span>
                  ))}
                  {activeTour.tags?.filter(t => !activeTour.moods?.includes(t)).slice(0, 2).map(t => (
                    <span key={t} className="text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-cream text-muted border border-warm-gray">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Story */}
                <div className="space-y-1">
                  <h3 className="font-display text-xl text-night font-light lowercase">
                    {activeTour.storyHeadline || activeTour.subtitle}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-light font-sans">
                    {activeTour.storyNarrative || activeTour.description}
                  </p>
                </div>

                <div className="h-px bg-cream" />

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-sand/60 p-3 rounded-xl border border-warm-gray/60">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">Best Season</span>
                    <span className="text-xs font-bold text-night flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-saffron" />
                      {activeTour.bestSeason || 'Oct to Mar'}
                    </span>
                  </div>
                  <div className="bg-sand/60 p-3 rounded-xl border border-warm-gray/60">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">Budget Index</span>
                    <span className="text-xs font-bold text-night">{activeTour.budgetRange || '₹30k-80k'}</span>
                  </div>
                  <div className="bg-sand/60 p-3 rounded-xl border border-warm-gray/60">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">Price / Day</span>
                    <span className="text-xs font-bold text-night">{formatINR(activeTour.price)}</span>
                  </div>
                  <div className="bg-sand/60 p-3 rounded-xl border border-warm-gray/60">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">Group Size</span>
                    <span className="text-xs font-bold text-night">{activeTour.groupSize}</span>
                  </div>
                </div>

                <div className="h-px bg-cream" />

                {/* Secret and Spot */}
                <div className="space-y-3">
                  {activeTour.localSecret && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-saffron/10 text-saffron flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">local secret</span>
                        <p className="text-xs text-night font-light leading-relaxed">{activeTour.localSecret}</p>
                      </div>
                    </div>
                  )}

                  {activeTour.photographySpot && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">photography spot</span>
                        <p className="text-xs text-night font-light leading-relaxed">{activeTour.photographySpot}</p>
                      </div>
                    </div>
                  )}

                  {activeTour.signatureExperience && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-night/10 text-night flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">signature experience</span>
                        <p className="text-xs text-night font-light leading-relaxed">{activeTour.signatureExperience}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-cream" />

                {/* Highlights */}
                {activeTour.highlights && activeTour.highlights.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block">top highlights</span>
                    <ul className="space-y-1.5">
                      {activeTour.highlights.slice(0, 4).map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-night font-light">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: activeTour.accents?.primary || '#E07B39' }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-warm-gray bg-warm-white flex gap-2 shrink-0 pb-[env(safe-area-inset-bottom,8px)]">
              <button
                onClick={() => onTourSelect(activeTour)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm hover:opacity-90"
                style={{ backgroundColor: activeTour.accents?.primary || '#E07B39' }}
              >
                <span>Explore Chapter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </>
        )}
    </div>
  );
}
