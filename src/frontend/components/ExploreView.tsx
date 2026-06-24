"use client";
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MapPin, Calendar, Clock, Compass, X, Camera, Sparkles, Map, List, ArrowRight, Star, Zap } from 'lucide-react';
import { Tour } from '../types';
import { CATEGORY_CHIPS } from '../data';
import SafeImage from './ui/SafeImage';
import dynamic from 'next/dynamic';
import { formatINR } from '../utils/currency';

const DiscoveryMap = dynamic(() => import('./map/DiscoveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F2ECE3] animate-pulse flex flex-col items-center justify-center">
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

const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.03, type: "spring" as const, stiffness: 100, damping: 20 } }),
};

export default function ExploreView({
  tours, onTourSelect, onToggleWishlist, wishlistIds,
  initialCategoryFilter = 'all', loading = false,
}: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategoryFilter || 'all');
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const filteredTours = useMemo(() => {
    let list = tours;
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(t =>
        t.moods.some(m => m.toLowerCase() === activeCategory.toLowerCase()) ||
        (t.tags || []).some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tours, activeCategory, searchQuery]);

  const activeTour = useMemo(() => tours.find(t => t.id === activeTourId) || null, [tours, activeTourId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && filteredTours.length > 0 && !activeTourId) {
      setActiveTourId(filteredTours[0].id);
    }
  }, []);

  return (
    <div className="h-[calc(100dvh-76px)] min-h-0 bg-[#F8F4EE] flex flex-col md:flex-row select-none relative overflow-hidden text-night">
      {/* Mobile toggle */}
      <div className={`md:hidden fixed bottom-[calc(68px+env(safe-area-inset-bottom,8px))] left-1/2 -translate-x-1/2 z-[60] bg-white/95 backdrop-blur-md text-night px-4 py-2.5 rounded-full shadow-card gap-3 text-xs font-mono uppercase tracking-wider border border-warm-gray/40 ${activeTour && mobileView === 'list' ? 'hidden' : 'flex'}`}>
        {(['list', 'map'] as const).map(view => {
          const Icon = view === 'list' ? List : Map;
          return (
            <button key={view} onClick={() => setMobileView(view)}
              className={`flex items-center gap-1.5 min-h-[44px] min-w-[52px] justify-center rounded-full px-3 transition-all ${mobileView === view ? 'bg-gold/10 text-gold font-bold' : 'opacity-60 hover:opacity-100'}`}
            >
              <Icon className="w-4 h-4" />{view === 'list' ? 'List' : 'Map'}
            </button>
          );
        })}
      </div>

      {/* Left sidebar: Filters + editorial stats */}
      <div className={`w-full md:w-[28%] flex flex-col border-r border-border bg-surface h-full overflow-hidden shrink-0 ${mobileView === 'list' ? 'block' : 'hidden md:flex'}`}>
        <div className="p-5 border-b border-border space-y-4 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-light text-night lowercase tracking-tight">
                explore <span className="font-display italic text-gold">atlas</span>
              </h1>
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-0.5">india's story atlas</p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-light text-gold">{filteredTours.length}</span>
              <p className="font-mono text-[8px] text-muted uppercase tracking-widest">Chapters</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-background border border-border focus-within:border-gold transition-colors">
            <Search className="w-4 h-4 text-muted/50 shrink-0" />
            <input type="text" placeholder="Search destinations..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-base text-night placeholder:text-muted/40 outline-none w-full font-sans font-light"
            />
            {searchQuery && (
              <motion.button onClick={() => setSearchQuery('')} className="shrink-0 w-8 h-8 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <X className="w-3.5 h-3.5 text-muted/50 hover:text-night" />
              </motion.button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5">
            {CATEGORY_CHIPS.map((chip) => (
              <motion.button key={chip.id}
                onClick={() => { setActiveCategory(chip.id); setActiveTourId(null); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[8px] font-mono uppercase tracking-wider transition-colors duration-300 border min-h-[36px] flex items-center cursor-pointer ${
                  activeCategory === chip.id
                    ? 'bg-night text-white border-night'
                    : 'bg-background text-muted border-border hover:border-gold'
                }`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                {chip.label.replace(' India', '')}
              </motion.button>
            ))}
          </div>

          {/* Editorial Metrics Ribbon (Moved below filters) */}
          <div className="flex justify-between items-center py-2 px-1 border-t border-border pt-3">
            {[
              { value: '87', label: 'Places' },
              { value: '250', label: 'Chapters' },
              { value: '1.2K', label: 'Stories' },
              { value: '15K', label: 'Explorers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-display text-base text-gold font-medium block leading-tight">{stat.value}</span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-muted/65">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background scrollbar-thin">
          {loading ? (
            Array(5).fill(null).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-secondary-surface animate-pulse border border-border" />
            ))
          ) : filteredTours.length === 0 ? (
            <motion.div className="text-center py-16 px-6 space-y-4"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary-surface border border-border flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-muted/40">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3"/>
                  <path d="M18 12V20M18 24V24.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="18" cy="18" r="4" stroke="currentColor" strokeWidth="0.75" fill="rgba(24,182,201,0.05)"/>
                </svg>
              </div>
              <div>
                <p className="font-display text-xl text-muted/60 font-light lowercase">no entries found</p>
                <p className="text-[11px] text-muted/40 font-light mt-1 max-w-xs mx-auto">try a different category or search query.</p>
              </div>
              <motion.button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-5 py-2.5 bg-teal text-white text-[9px] font-bold uppercase tracking-wider rounded-full hover:bg-teal/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Compass className="w-3 h-3" />
                <span>Clear Filters</span>
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredTours.map((tour, idx) => {
                const isActive = tour.id === activeTourId;
                return (
                  <motion.div key={tour.id} layout
                    variants={listItemVariants} initial="hidden" animate="visible" custom={idx}
                    onClick={() => setActiveTourId(tour.id)}
                    className={`group rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-surface border-teal shadow-card'
                        : 'bg-surface border-border hover:border-muted/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center p-2.5 gap-3">
                      <div className="w-[72px] h-[72px] shrink-0 overflow-hidden bg-secondary-surface rounded-2xl relative">
                        <SafeImage src={tour.bannerImage} alt={tour.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between text-left py-0.5">
                        <div>
                          <div className="flex items-center justify-between text-[8px] font-mono text-muted uppercase tracking-widest">
                            <span className="truncate max-w-[120px]">{tour.location.split(',')[0]}</span>
                          </div>
                          <h3 className="font-display text-[15px] text-night font-light lowercase truncate mt-0.5 leading-tight group-hover:text-gold transition-colors">{tour.title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] font-semibold text-night">{formatINR(tour.price)}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-gold text-gold" />
                              <span className="text-[9px] font-bold text-night">{parseFloat(tour.rating.toFixed(1))}</span>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-teal flex items-center gap-0.5 group-hover:gap-1 transition-all">
                              Explore <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Center: Map panel */}
      <div className={`flex-1 h-full relative ${mobileView === 'map' ? 'block' : 'hidden md:block'}`}>
        <DiscoveryMap tours={tours} activeTourId={activeTourId} onActiveTourChange={setActiveTourId} onSelectTour={onTourSelect} />
      </div>

      {/* Right: Destination Preview card */}
      <div className={`hidden lg:flex w-[28%] flex-col border-l border-border bg-surface h-full overflow-y-auto shrink-0 p-5 ${activeTour ? '' : 'items-center justify-center'}`}>
        {activeTour ? (
          <motion.div key={activeTour.id} className="space-y-5 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="aspect-[3/2] rounded-3xl overflow-hidden bg-secondary-surface shadow-card border border-border group">
              <img src={activeTour.bannerImage} alt={activeTour.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-[8px] font-mono text-muted uppercase tracking-widest">
                <span className="font-bold text-gold">{activeTour.chapterName || ''}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activeTour.duration}</span>
              </div>
              {activeTour.chapterTitle && (
                <span className="font-mono text-[9px] text-muted/70 uppercase tracking-widest block -mt-1">{activeTour.chapterTitle}</span>
              )}
              <h2 className="font-display text-[28px] text-night font-light lowercase leading-[0.95]">{activeTour.title}</h2>
              <p className="text-xs text-muted/90 font-light leading-relaxed line-clamp-3">{activeTour.storyNarrative || activeTour.subtitle}</p>
              <div className="flex flex-wrap gap-1.5">
                {activeTour.moods?.slice(0, 3).map(m => (
                  <span key={m} className="px-2.5 py-1 rounded-full bg-sand text-[8px] font-bold uppercase tracking-wider text-muted border border-warm-gray/30">{m}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-xl font-display font-medium text-night">{formatINR(activeTour.price)}</span>
                  <span className="text-[9px] text-muted font-light ml-1">/ day</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-bold text-night">{parseFloat(activeTour.rating.toFixed(1))}</span>
                </div>
              </div>
              <motion.button onClick={() => onTourSelect(activeTour)}
                className="w-full py-3.5 rounded-full bg-night text-white text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-ocean transition-all cursor-pointer flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Compass className="w-4 h-4 text-gold" />
                View Full Chapter
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center space-y-2">
            <MapPin className="w-8 h-8 text-muted/20 mx-auto" />
            <p className="text-xs text-muted/50 font-light">select a destination</p>
            <p className="text-[9px] text-muted/30 font-mono uppercase tracking-wider">from the atlas to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}