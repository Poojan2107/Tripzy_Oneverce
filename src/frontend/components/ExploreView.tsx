"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Heart, MapPin, Calendar, Clock, Compass, X, Camera, Sparkles, Map, List, ArrowRight } from 'lucide-react';
import { Tour } from '../types';
import { CATEGORY_CHIPS } from '../data';
import ScrollReveal from './ui/ScrollReveal';
import dynamic from 'next/dynamic';

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
      className="min-h-screen bg-sand pt-16 flex flex-col md:flex-row select-none"
      style={{
        ['--color-accent-primary' as any]: accentPrimary,
        ['--color-accent-secondary' as any]: accentSecondary,
      }}
    >
      {/* ── MOBILE VIEW TOGGLE BAR ── */}
      <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-night text-white px-4 py-2.5 rounded-full shadow-lg flex gap-4 text-xs font-mono uppercase tracking-wider">
        <button 
          onClick={() => setMobileView('list')}
          className={`flex items-center gap-1.5 ${mobileView === 'list' ? 'text-gold font-bold' : 'opacity-70'}`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <div className="w-px h-4 bg-white/20" />
        <button 
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 ${mobileView === 'map' ? 'text-gold font-bold' : 'opacity-70'}`}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* ── LEFT SIDEBAR PANEL (35% on Desktop) ── */}
      <div className={`w-full md:w-[35%] flex flex-col border-r border-warm-gray bg-warm-white h-[calc(100vh-4rem)] overflow-hidden shrink-0 ${
        mobileView === 'list' ? 'block' : 'hidden md:flex'
      }`}>
        {/* Search and Filters Header */}
        <div className="p-5 border-b border-warm-gray space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-light text-night lowercase tracking-tight">
              explore <span className="font-display italic text-gold">atlas</span>
            </h1>
            <span className="font-mono text-[9px] text-muted/60 uppercase tracking-widest">
              {filteredTours.length} Chapters
            </span>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sand border border-warm-gray focus-within:border-gold transition-colors">
            <Search className="w-4 h-4 text-muted/40 shrink-0" />
            <input
              type="text"
              placeholder="Search Indian chapters..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-night placeholder:text-muted/30 outline-none w-full font-sans font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0">
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
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[8px] font-mono uppercase tracking-wider transition-all duration-300 border ${
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
        <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin">
          {loading ? (
            Array(5).fill(null).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-cream animate-pulse" />
            ))
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Compass className="w-8 h-8 text-muted/20 mx-auto" />
              <p className="font-display italic text-lg text-muted/50">no chapters found</p>
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
              return (
                <div
                  key={tour.id}
                  onClick={() => {
                    setActiveTourId(tour.id);
                    if (window.innerWidth < 768) {
                      // On mobile, keep list but scroll down or open drawer
                    }
                  }}
                  className={`group p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                    isActive
                      ? 'bg-white border-gold shadow-sm'
                      : 'bg-transparent border-warm-gray/60 hover:bg-white/40 hover:border-warm-gray'
                  }`}
                >
                  <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 bg-cream">
                    <img 
                      src={tour.bannerImage} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[8px] font-mono text-muted/50 uppercase tracking-widest">
                        <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                        <span>{tour.duration.split(',')[0]}</span>
                      </div>
                      <h3 className="font-display text-xl text-night leading-tight font-light lowercase truncate mt-1">
                        {tour.title}
                      </h3>
                      <p className="text-[10px] text-muted/60 font-light truncate mt-0.5">
                        {tour.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-night pt-1">
                      <span>₹{(tour.price * 83).toLocaleString('en-IN')}</span>
                      <span className="text-[8px] font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {tour.moods?.[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT MAP PANEL (65% on Desktop) ── */}
      <div className={`flex-1 h-[calc(100vh-4rem)] relative ${
        mobileView === 'map' ? 'block' : 'hidden md:block'
      }`}>
        <DiscoveryMap
          tours={filteredTours}
          activeTourId={activeTourId}
          onActiveTourChange={setActiveTourId}
          onSelectTour={onTourSelect}
        />

        {/* ── SLIDE-OUT DRAWER OVERLAY ── */}
        {activeTour && (
          <div className="absolute top-4 bottom-4 right-4 w-[90%] sm:w-[380px] bg-white border border-warm-gray rounded-3xl shadow-elevated z-30 overflow-hidden flex flex-col animate-page-enter">
            {/* Header image */}
            <div className="relative aspect-[16/10] bg-cream shrink-0">
              <img src={activeTour.bannerImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <button 
                onClick={() => setActiveTourId(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-warm-gray flex items-center justify-center text-night hover:bg-white shadow-sm cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">
                  {activeTour.chapterName || 'Featured Chapter'}
                </span>
                <h2 className="font-display text-2.5xl text-white font-light lowercase leading-none">
                  {activeTour.title}
                </h2>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin text-left">
              {/* Region and title */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[9px] font-mono text-saffron uppercase tracking-wider">
                  <MapPin className="w-3 h-3" />
                  {activeTour.location}
                </div>
                <h3 className="font-display text-xl text-night font-light lowercase">
                  {activeTour.storyHeadline || activeTour.subtitle}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light font-sans">
                  {activeTour.storyNarrative || activeTour.description}
                </p>
              </div>

              <div className="h-px bg-cream" />

              {/* Secret and Spot */}
              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-saffron/10 text-saffron flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">local secret</span>
                    <p className="text-xs text-night font-light leading-relaxed">{activeTour.localSecret || 'Available on request'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">photography spot</span>
                    <p className="text-xs text-night font-light leading-relaxed">{activeTour.photographySpot || 'Explore the main trails'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-night/10 text-night flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 block leading-none mb-1">signature experience</span>
                    <p className="text-xs text-night font-light leading-relaxed">{activeTour.signatureExperience}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-cream" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-warm-white p-3 rounded-xl border border-warm-gray/60">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">best season</span>
                  <span className="font-bold text-night flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-saffron" />
                    {activeTour.bestSeason || 'Oct to Mar'}
                  </span>
                </div>
                <div className="bg-warm-white p-3 rounded-xl border border-warm-gray/60">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mb-1">budget index</span>
                  <span className="font-bold text-night flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-gold" />
                    {activeTour.budgetRange || '₹30k - 80k'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-warm-gray bg-warm-white flex gap-2 shrink-0">
              <button
                onClick={() => onToggleWishlist(activeTour.id)}
                className="p-3.5 rounded-xl border border-warm-gray bg-white hover:bg-rose-50 hover:border-rose-200 text-muted transition-colors"
              >
                <Heart className={`w-4.5 h-4.5 ${wishlistIds.includes(activeTour.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
              <button
                onClick={() => onTourSelect(activeTour)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-night text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-saffron transition-all cursor-pointer shadow-sm"
              >
                <span>explore chapter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
