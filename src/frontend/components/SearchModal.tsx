"use client";
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, MapPin, Compass, Clock, Sparkles } from 'lucide-react';
import { Tour } from '../types';
import { trackEvent } from '../utils/analytics';

interface SearchModalProps { isOpen: boolean; onClose: () => void; tours: Tour[]; onSelectTour: (tour: Tour) => void; }

const QUICK_TAGS = ['Adventure', 'Relaxation', 'Luxury', 'Food', 'Culture', 'Nature'];
const SUGGESTED_DESTINATIONS = ['Varanasi', 'Kerala', 'Ladakh', 'Udaipur', 'Goa'];

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.8 } },
  exit: { opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.15 } },
};

export default function SearchModal({ isOpen, onClose, tours, onSelectTour }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleTab);
    return () => {
      window.removeEventListener('keydown', handleTab);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    try { const saved = localStorage.getItem('tripzy_recent_searches'); if (saved) setRecentSearches(JSON.parse(saved)); }
    catch (e) { console.error("Failed to load recent searches", e); }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    try {
      const cleaned = term.trim();
      if (!cleaned) return;
      setRecentSearches(prev => {
        const filtered = prev.filter(t => t.toLowerCase() !== cleaned.toLowerCase());
        const updated = [cleaned, ...filtered].slice(0, 5);
        localStorage.setItem('tripzy_recent_searches', JSON.stringify(updated));
        return updated;
      });
    } catch (e) { console.error(e); }
  };

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      setRecentSearches(prev => { const updated = prev.filter(t => t !== term); localStorage.setItem('tripzy_recent_searches', JSON.stringify(updated)); return updated; });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', handleGlobalKeyDown);
    if (isOpen) { document.body.style.overflow = 'hidden'; setFocusedIndex(-1); setTimeout(() => inputRef.current?.focus(), 50); }
    return () => { window.removeEventListener('keydown', handleGlobalKeyDown); document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (query || selectedTag) {
      setIsFiltering(true);
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        setIsFiltering(false);
        const activeTerm = selectedTag || query.trim();
        if (activeTerm && activeTerm.length >= 3) trackEvent('search', { query: activeTerm });
      }, 300);
    } else { setIsFiltering(false); }
    return () => { if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current); };
  }, [query, selectedTag]);

  useEffect(() => setFocusedIndex(-1), [query, selectedTag]);

  const matchedTours = useMemo(() => {
    const activeTerm = selectedTag ? selectedTag.toLowerCase() : query.toLowerCase().trim();
    if (activeTerm === '') return tours.slice(0, 3);
    return tours.filter(t =>
      t.title.toLowerCase().includes(activeTerm) || t.location.toLowerCase().includes(activeTerm) ||
      t.subtitle.toLowerCase().includes(activeTerm) || t.description.toLowerCase().includes(activeTerm) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(activeTerm)) ||
      (t.moods || []).some(m => m.toLowerCase().includes(activeTerm))
    );
  }, [query, selectedTag, tours]);

  const handleSelect = (tour: Tour) => { saveRecentSearch(tour.title); trackEvent('search_select', { tourId: tour.id, title: tour.title }); onSelectTour(tour); onClose(); };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (matchedTours.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(prev => (prev + 1) % matchedTours.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(prev => (prev - 1 + matchedTours.length) % matchedTours.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (focusedIndex >= 0 && focusedIndex < matchedTours.length) handleSelect(matchedTours[focusedIndex]); else if (matchedTours.length > 0) handleSelect(matchedTours[0]); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center md:pt-[10vh] px-0 md:px-4"
          variants={overlayVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" variants={overlayVariants} />

          <motion.div ref={modalRef} role="dialog" aria-modal="true" aria-label="Search destinations" className="w-full h-full md:h-auto md:max-w-lg bg-white md:rounded-3xl shadow-elevated border-0 md:border border-warm-gray/50 relative z-10 overflow-hidden flex flex-col text-night"
            variants={modalVariants} initial="hidden" animate="visible" exit="exit">

            <div className="p-4 pb-3 border-b border-warm-gray/30 shrink-0">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/30" />
                  <input ref={inputRef} type="text" autoFocus placeholder="Search destinations, regional chapters..."
                    value={query} onChange={e => { setQuery(e.target.value); if (selectedTag) setSelectedTag(null); }}
                    onKeyDown={handleInputKeyDown}
                    className="w-full pl-10 pr-4 py-3 bg-background text-night text-sm md:text-base rounded-xl border border-warm-gray/40 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 placeholder:text-muted/30 font-light" />
                </div>
                <motion.button onClick={onClose} aria-label="Close search"
                  className="md:hidden p-3 rounded-xl hover:bg-secondary-surface transition-colors shrink-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-warm-gray/40"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <X className="w-4 h-4 text-muted/60" />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {QUICK_TAGS.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <motion.button key={tag} onClick={() => {
                      if (selectedTag === tag) { setSelectedTag(null); setQuery(''); }
                      else { setSelectedTag(tag); trackEvent('search_tag_click', { tag }); }
                    }}
                      className={`px-3 py-2 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors duration-200 border min-h-[38px] flex items-center cursor-pointer ${isActive ? 'bg-night text-white border-night font-bold' : 'bg-background text-muted/70 border-warm-gray/40'}`}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {tag}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!query && !selectedTag && (
                <motion.div key="suggestions" className="p-4 pt-3 space-y-4 text-left border-b border-warm-gray/30 shrink-0"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 font-bold">Suggested Chapters</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_DESTINATIONS.map((dest) => (
                        <motion.button key={dest} onClick={() => { setQuery(dest); setSelectedTag(null); trackEvent('search_suggestion_click', { destination: dest }); }}
                          className="px-3 py-1.5 bg-background text-[10px] font-semibold text-muted/80 border border-warm-gray/40 rounded-lg cursor-pointer"
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                          {dest}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 font-bold">Recent Searches</span>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term) => (
                          <motion.div key={term} onClick={() => setQuery(term)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-background text-[10px] text-muted/80 border border-warm-gray/40 rounded-lg cursor-pointer transition-colors group"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Clock className="w-2.5 h-2.5 text-muted/40" />
                            <span>{term}</span>
                            <button onClick={(e) => removeRecentSearch(e, term)}
                              className="p-0.5 rounded-full hover:bg-secondary-surface text-muted/40 hover:text-coral shrink-0 ml-1 transition-colors"
                              aria-label={`Remove recent search ${term}`}>
                              <X className="w-2 h-2" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 min-h-[220px]">
              {isFiltering ? (
                <div className="space-y-2 py-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-3 p-3 rounded-xl bg-background animate-pulse">
                      <div className="w-12 h-12 rounded-lg bg-border shrink-0" />
                      <div className="flex-1 space-y-2"><div className="w-1/4 h-3 bg-border rounded" /><div className="w-3/4 h-4 bg-border rounded" /><div className="w-1/2 h-3 bg-border rounded" /></div>
                    </div>
                  ))}
                </div>
              ) : matchedTours.length > 0 ? (
                <div className="space-y-1">
                  {(query || selectedTag) && (
                    <div className="px-2 py-1 text-left"><span className="text-[8px] font-mono uppercase tracking-widest text-muted/50">Matched Chapters ({matchedTours.length})</span></div>
                  )}
                  <AnimatePresence>
                    {matchedTours.map((tour, index) => {
                      const isFocused = index === focusedIndex;
                      return (
                        <motion.div key={tour.id} layout
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, type: "spring", stiffness: 100, damping: 20 }}
                          onClick={() => handleSelect(tour)}
                          className={`flex gap-3 p-3 rounded-xl cursor-pointer group transition-colors duration-200 text-left border ${isFocused ? 'bg-background border-teal/30 shadow-sm' : 'bg-transparent border-transparent hover:bg-background'}`}>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-surface shrink-0 relative">
                            <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[9px] text-muted/50 font-mono uppercase tracking-wider">
                              <MapPin className="w-2.5 h-2.5 text-teal" /><span>{tour.location}</span>
                            </div>
                            <p className={`text-xs font-semibold text-night truncate transition-colors ${isFocused ? 'text-teal' : 'group-hover:text-teal'}`}>{tour.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-1"><Star className="w-2.5 h-2.5 text-gold fill-gold" /><span className="text-[9px] font-bold text-muted/60">{parseFloat(tour.rating.toFixed(1))}</span></div>
                              {tour.moods?.length > 0 && <span className="text-[9px] font-mono text-muted/40 uppercase">{tour.moods.slice(0, 1).join('')}</span>}
                              <span className="text-muted/20">·</span>
                              <span className="text-[9px] font-mono text-muted/50">{tour.duration}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div className="py-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Compass className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                  <p className="text-sm text-night/80 font-medium">No results found</p>
                  <p className="text-xs text-muted/60 mt-1">Try a different search term or mood tag.</p>
                </motion.div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-warm-gray/30 flex items-center justify-between text-[9px] text-muted/50 font-mono uppercase tracking-wider shrink-0 bg-surface">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-gold" /><span>Search destinations</span></span>
              <span className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-surface border border-warm-gray/40 rounded text-[8px]">↑↓ navigate</span>
                <span className="px-1.5 py-0.5 bg-surface border border-warm-gray/40 rounded text-[8px]">enter select</span>
                <span className="px-1.5 py-0.5 bg-surface border border-warm-gray/40 rounded text-[8px]">esc close</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}