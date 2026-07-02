"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MapPin, Calendar, Clock, Compass, X, Camera, Sparkles, Map, List, ArrowRight, Star, Zap, SlidersHorizontal, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';
import { Tour } from '../types';
import { CATEGORY_CHIPS } from '../data';
import SafeImage from './ui/SafeImage';
import dynamic from 'next/dynamic';
import { formatINR } from '../utils/currency';
import { searchDestinations, type SearchFilters } from '../../backend/actions/searchActions';

export function getMoodLabel(id: string): string {
  if (id === 'varanasi-spiritual') return 'Spiritual Chapter';
  if (['udaipur-mewar', 'jaisalmer-fort', 'hampi-ruins'].includes(id)) return 'Heritage Story';
  if (['kerala-houseboats', 'andaman-reefs', 'goa-beach'].includes(id)) return 'Coastal Escape';
  return 'Hidden Gem';
}

const DiscoveryMap = dynamic(() => import('./map/DiscoveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary-surface animate-pulse flex flex-col items-center justify-center">
      <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/60">Loading Atlas Map...</span>
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

const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Challenging'];

export default function ExploreView({
  tours, onTourSelect, onToggleWishlist, wishlistIds,
  initialCategoryFilter = 'all', loading = false,
}: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategoryFilter || 'all');
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [season, setSeason] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isSearchActive = searchQuery.trim() || activeCategory !== 'all' || priceMin || priceMax || difficulty || season;

  const runSearch = useCallback(async (q: string, cat: string, p: number) => {
    setSearchLoading(true);
    const filters: SearchFilters = {};
    if (cat && cat !== 'all') filters.category = cat;
    if (priceMin !== undefined) filters.priceMin = priceMin;
    if (priceMax !== undefined) filters.priceMax = priceMax;
    if (difficulty) filters.difficulty = difficulty;
    if (season.trim()) filters.season = season.trim();

    const res = await searchDestinations(q, filters, p, 10);
    if (res.success) {
      setSearchResults(res.data ?? []);
      setTotalPages(res.pagination.totalPages);
      setTotalResults(res.pagination.total);
    } else {
      setSearchResults([]);
      setTotalPages(1);
      setTotalResults(0);
    }
    setSearchLoading(false);
  }, [priceMin, priceMax, difficulty, season]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim() && activeCategory === 'all' && !priceMin && !priceMax && !difficulty && !season) {
      setSearchResults(null);
      setTotalPages(1);
      setTotalResults(0);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setPage(1);
      runSearch(searchQuery, activeCategory, 1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, activeCategory, priceMin, priceMax, difficulty, season, runSearch]);

  useEffect(() => {
    if (isSearchActive && page > 1) {
      runSearch(searchQuery, activeCategory, page);
    }
  }, [page]);

  const filteredTours = useMemo(() => {
    if (searchResults !== null) return searchResults;
    let list = tours;
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(t =>
        (t.moods || []).some(m => {
          const s = typeof m === 'string' ? m : (m as any)?.mood?.name || (m as any)?.moodId || '';
          return s.toLowerCase() === activeCategory.toLowerCase();
        }) ||
        (t.tags || []).some(tag => tag && typeof tag === 'string' && tag.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) || 
        (t.location || '').toLowerCase().includes(q) ||
        (t.subtitle || '').toLowerCase().includes(q) || 
        (t.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [tours, activeCategory, searchQuery, searchResults]);

  const activeTour = useMemo(() => tours.find(t => t.id === activeTourId) || null, [tours, activeTourId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && filteredTours.length > 0 && !activeTourId) {
      setActiveTourId(filteredTours[0]?.id || filteredTours[0]?.slug || null);
    }
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceMin(undefined);
    setPriceMax(undefined);
    setDifficulty(undefined);
    setSeason('');
    setPage(1);
    setSearchResults(null);
  };

  return (
    <div className="h-[calc(100dvh-var(--nav-bottom-height)-52px)] md:h-[calc(100dvh-76px)] lg:h-[calc(100dvh-84px)] min-h-0 bg-background flex flex-col md:flex-row select-none relative overflow-hidden text-night">
      {/* Mobile toggle */}
      <div className={`md:hidden fixed bottom-[calc(var(--nav-bottom-height)-20px+var(--safe-bottom))] bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-white/95 backdrop-blur-md text-night px-4 py-2.5 rounded-full shadow-card gap-3 text-xs font-mono uppercase tracking-wider border border-border/40 ${activeTour && mobileView === 'list' ? 'hidden' : 'flex'}`}>
        {(['list', 'map'] as const).map(view => {
          const Icon = view === 'list' ? List : Map;
          return (
            <button key={view} onClick={() => setMobileView(view)}
              className={`flex items-center gap-1.5 btn-ghost min-h-[44px] min-w-[52px] justify-center px-3 ${mobileView === view ? 'bg-gold/10 text-gold font-bold' : 'opacity-60 hover:opacity-100'}`}
            >
              <Icon className="w-4 h-4" />{view === 'list' ? 'List' : 'Map'}
            </button>
          );
        })}
      </div>

      {/* Left sidebar */}
      <div className={`w-full md:w-[33%] flex flex-col border-r border-border bg-surface h-full overflow-hidden shrink-0 min-w-0 ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-6 border-b border-border space-y-5 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-light text-night lowercase tracking-tight">
                explore <span className="font-display italic text-gold">atlas</span>
              </h1>
              <p className="text-micro font-mono text-muted uppercase tracking-widest mt-0.5">india's story atlas</p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-light text-gold">{searchResults !== null ? totalResults : filteredTours.length}</span>
              <p className="font-mono text-micro text-muted uppercase tracking-widest">Chapters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-background border border-border/80 focus-within:border-gold/60 focus-within:shadow-[0_0_12px_rgba(244,182,61,0.12)] transition-all flex-1">
              <Search className="w-4 h-4 text-muted/65 shrink-0" />
              <input type="text" placeholder="Search destinations..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-body text-night placeholder:text-muted/50 outline-none w-full font-light"
              />
              {searchQuery && (
                <motion.button onClick={() => setSearchQuery('')} aria-label="Clear search" className="shrink-0 w-8 h-8 flex items-center justify-center btn-ghost"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <X className="w-3.5 h-3.5 text-muted/50 hover:text-night" />
                </motion.button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-lg btn-ghost border transition-all duration-300 ${showFilters ? 'bg-night text-white border-night' : 'border-border text-muted hover:border-gold/50'}`}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-6 px-6">
            {CATEGORY_CHIPS.map((chip) => (
              <motion.button key={chip.id}
                onClick={() => { setActiveCategory(chip.id); setActiveTourId(null); }}
                className={`flex-shrink-0 px-4 py-2 border rounded-full text-meta font-mono tracking-wider transition-all duration-300 ${
                  activeCategory === chip.id
                    ? 'bg-night text-white border-night shadow-sm font-bold'
                    : 'bg-background text-muted/80 border-border/70 hover:bg-secondary-surface hover:text-night'
                }`}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                {chip.label.replace(' India', '')}
              </motion.button>
            ))}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div className="border-t border-border pt-4 space-y-4"
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-micro font-mono text-muted/65 uppercase tracking-wider">Min Price</label>
                    <input type="number" placeholder="Min" value={priceMin ?? ''} onChange={e => setPriceMin(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-night outline-none focus:border-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-micro font-mono text-muted/65 uppercase tracking-wider">Max Price</label>
                    <input type="number" placeholder="Max" value={priceMax ?? ''} onChange={e => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-night outline-none focus:border-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-micro font-mono text-muted/65 uppercase tracking-wider">Difficulty</label>
                    <select value={difficulty ?? ''} onChange={e => setDifficulty(e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-night outline-none focus:border-gold">
                      <option value="">Any</option>
                      {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-micro font-mono text-muted/65 uppercase tracking-wider">Season</label>
                    <input type="text" placeholder="e.g. Winter" value={season} onChange={e => setSeason(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-night outline-none focus:border-gold" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="py-1 px-1 border-t border-border pt-4 flex items-center justify-between">
            <span className="text-meta font-mono text-muted/70 font-semibold uppercase tracking-wider">India's Story Chapters</span>
            {isSearchActive && (
              <button onClick={clearFilters} className="text-micro font-mono text-coral hover:text-coral/80 uppercase tracking-wider font-bold">
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background scrollbar-thin pb-[calc(var(--nav-bottom-height)+8px+var(--safe-bottom))] md:pb-4">
          {searchLoading ? (
            Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-secondary-surface animate-pulse border border-border" />
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
                <p className="text-small text-muted/40 font-light mt-1 max-w-xs mx-auto">try a different category or search query.</p>
              </div>
              <motion.button onClick={clearFilters}
                className="px-5 py-2.5 btn-primary text-micro font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Compass className="w-3 h-3" />
                <span>Clear Filters</span>
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredTours.map((tour: any, idx: number) => {
                const isActive = tour.id === activeTourId || tour.slug === activeTourId;
                return (
                  <motion.div key={tour.id || tour.slug}
                    variants={listItemVariants} initial="hidden" animate="visible" custom={idx}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        const fullTour = tours.find(t => t.id === tour.id || t.id === tour.slug);
                        if (fullTour) onTourSelect(fullTour);
                      } else {
                        setActiveTourId(tour.id || tour.slug);
                      }
                    }}
                    className={`group rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-surface border-teal shadow-md animate-scale-in'
                        : 'bg-surface border-border/70 hover:border-muted/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center p-3.5 gap-4">
                      <div className="w-[80px] h-[80px] shrink-0 overflow-hidden bg-secondary-surface rounded-lg relative">
                        <SafeImage src={tour.bannerImage || tour.images?.[0] || ''} alt={tour.name || tour.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between text-left py-0.5 h-[80px]">
                        <div>
                          <div className="flex items-center gap-1.5 text-meta font-mono text-muted">
                            <span className="text-gold font-bold">{tour.chapterName || 'Chapter'}</span>
                            <span className="text-border/40">·</span>
                            <span className="truncate">{tour.city || (typeof tour.location === 'string' ? tour.location.split(',')[0] : '') || ''}</span>
                          </div>
                          <h3 className="font-display text-card text-night font-light lowercase line-clamp-1 mt-1 leading-tight group-hover:text-gold transition-colors">{tour.name || tour.title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-meta font-bold text-night">from {formatINR(tour.price)}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                              <span className="text-meta font-bold text-night">{tour.rating ? parseFloat(tour.rating.toFixed(1)) : '—'}</span>
                            </div>
                            <span className="text-meta font-bold text-teal flex items-center gap-0.5 group-hover:gap-1 transition-all">
                              Explore <ArrowRight className="w-3.5 h-3.5" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2 pb-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded btn-ghost border border-border disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-micro font-mono font-bold ${p === page ? 'bg-night text-white' : 'btn-ghost border border-border text-muted hover:text-night'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded btn-ghost border border-border disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Map panel */}
      <div className={`flex-grow h-full relative min-w-0 overflow-hidden ${mobileView === 'map' ? 'flex' : 'hidden md:flex'} flex-col`}>
        <DiscoveryMap tours={tours} activeTourId={activeTourId} onActiveTourChange={setActiveTourId} onSelectTour={(t) => t && onTourSelect(t)} />
      </div>

      {/* Right: Destination Preview card */}
      <div className={`hidden lg:flex w-[32%] flex-col border-l border-border bg-surface h-full overflow-y-auto shrink-0 p-6 ${activeTour ? '' : 'items-center justify-center'}`}>
        {activeTour ? (
          <motion.div key={activeTour.id} className="space-y-6 w-full text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-secondary-surface shadow-sm border border-border/70 group" style={{ position: 'relative' }}>
              <SafeImage src={activeTour.bannerImage} alt={activeTour.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-1.5 text-meta font-mono text-muted">
                <span className="font-bold text-gold">{activeTour.chapterName || 'Chapter 01'}</span>
                {activeTour.chapterTitle && (
                  <>
                    <span className="text-border/40">·</span>
                    <span>{activeTour.chapterTitle}</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-section text-night font-light lowercase leading-tight line-clamp-2">{activeTour.title}</h2>
              <p className="text-body text-muted/80 font-light leading-relaxed line-clamp-3">{activeTour.storyNarrative || activeTour.subtitle}</p>
              <div className="flex items-center gap-2 text-caption font-mono text-muted">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activeTour.duration}</span>
                <span className="text-border/40">·</span>
                <span className="font-bold text-teal capitalize">{getMoodLabel(activeTour.id)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTour.moods?.slice(0, 3).map((m: string) => (
                  <span key={m} className="px-2.5 py-1 rounded-sm bg-background text-meta text-muted border border-border/30 font-semibold">{m}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-meta text-muted/50 relative group cursor-help">
                  <span className="text-micro font-mono text-gold block -mb-0.5">estimated baseline</span>
                  <span className="text-body font-semibold text-night">{formatINR(activeTour.price)}</span>
                  <span className="ml-0.5 text-meta text-muted/60">/ day avg</span>
                  <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-night text-white text-[10px] rounded-lg border border-border/30 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-30 leading-relaxed">
                    Baseline average. Customize your budget (Budget, Balanced, or Luxury) inside the AI Planner tab.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button onClick={() => onTourSelect(activeTour)}
                    className="text-micro font-mono text-teal hover:text-teal/80 underline underline-offset-2 decoration-teal/30 cursor-pointer hidden lg:inline-flex items-center gap-1"
                    whileHover={{ gap: '6px' }}>
                    Plan with your budget <ArrowRight className="w-3 h-3" />
                  </motion.button>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className="text-meta font-bold text-night">{parseFloat(activeTour.rating.toFixed(1))}</span>
                  </div>
                </div>
              </div>
              <motion.button onClick={() => onTourSelect(activeTour)}
                className="btn btn-night w-full h-12 px-6 rounded-lg text-caption flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Compass className="w-4 h-4 text-gold" />
                View Chapter
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center space-y-2">
            <MapPin className="w-8 h-8 text-muted/20 mx-auto" />
            <p className="text-xs text-muted/50 font-light">select a destination</p>
            <p className="text-micro text-muted/30 font-mono uppercase tracking-wider">from the atlas to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
