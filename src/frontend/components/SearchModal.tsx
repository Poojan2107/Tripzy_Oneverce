import { useEffect, useState, useMemo, useRef } from 'react';
import { Search, X, Star, MapPin, Compass, Clock, Sparkles } from 'lucide-react';
import { Tour } from '../types';
import { trackEvent } from '../utils/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

const QUICK_TAGS = ['Adventure', 'Relaxation', 'Luxury', 'Food', 'Culture', 'Nature'];
const SUGGESTED_DESTINATIONS = ['Varanasi', 'Kerala', 'Ladakh', 'Udaipur', 'Goa'];

export default function SearchModal({
  isOpen,
  onClose,
  tours,
  onSelectTour
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tripzy_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
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
    } catch (e) {
      console.error(e);
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      setRecentSearches(prev => {
        const updated = prev.filter(t => t !== term);
        localStorage.setItem('tripzy_recent_searches', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset index on open
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, isOpen]);

  // Analytics query trigger
  useEffect(() => {
    if (query || selectedTag) {
      setIsFiltering(true);
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        setIsFiltering(false);
        const activeTerm = selectedTag || query.trim();
        if (activeTerm && activeTerm.length >= 3) {
          trackEvent('search', { query: activeTerm });
        }
      }, 300);
    } else {
      setIsFiltering(false);
    }
    return () => { if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current); };
  }, [query, selectedTag]);

  // Reset focus index when matches change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [query, selectedTag]);

  const matchedTours = useMemo(() => {
    const activeTerm = selectedTag ? selectedTag.toLowerCase() : query.toLowerCase().trim();
    if (activeTerm === '') return tours.slice(0, 3);
    return tours.filter(t =>
      t.title.toLowerCase().includes(activeTerm) ||
      t.location.toLowerCase().includes(activeTerm) ||
      t.subtitle.toLowerCase().includes(activeTerm) ||
      t.description.toLowerCase().includes(activeTerm) ||
      t.tags.some(tag => tag.toLowerCase().includes(activeTerm)) ||
      (t.moods || []).some(m => m.toLowerCase().includes(activeTerm))
    );
  }, [query, selectedTag, tours]);

  const handleSelect = (tour: Tour) => {
    saveRecentSearch(tour.title);
    trackEvent('search_select', { tourId: tour.id, title: tour.title });
    onSelectTour(tour);
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (matchedTours.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % matchedTours.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + matchedTours.length) % matchedTours.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < matchedTours.length) {
        handleSelect(matchedTours[focusedIndex]);
      } else if (matchedTours.length > 0) {
        handleSelect(matchedTours[0]);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setQuery('');
    } else {
      setSelectedTag(tag);
      trackEvent('search_tag_click', { tag });
    }
  };

  const handleSuggestionClick = (dest: string) => {
    setQuery(dest);
    setSelectedTag(null);
    trackEvent('search_suggestion_click', { destination: dest });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedTag) setSelectedTag(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:pt-[10vh] px-0 md:px-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200" />
      
      {/* Modal box */}
      <div className="w-full h-full md:h-auto md:max-w-lg bg-[#0C2533] md:rounded-3xl shadow-elevated border-0 md:border border-white/10 relative z-10 overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out] text-white">
        
        {/* Top input zone */}
        <div className="p-4 pb-3 border-b border-white/10 shrink-0">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                placeholder="Search destinations, regional chapters..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="w-full pl-10 pr-4 py-3 bg-[#081A24] text-white text-sm md:text-base rounded-xl border border-white/10 outline-none focus:border-[#148596] focus:ring-2 focus:ring-[#148596]/20 transition-all duration-200 placeholder:text-white/30 font-light"
              />
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={onClose} 
              aria-label="Close search"
              className="md:hidden p-3 rounded-xl hover:bg-white/5 transition-colors shrink-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Quick mood chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {QUICK_TAGS.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-2 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border min-h-[38px] flex items-center ${
                    isActive
                      ? 'bg-[#148596] text-white border-[#148596] font-bold'
                      : 'bg-[#081A24] text-white/60 border-white/10 hover:border-[#148596]/30 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggestion & Recent Searches Container (Only if query is empty) */}
        {!query && !selectedTag && (
          <div className="p-4 pt-3 space-y-4 text-left border-b border-white/10 shrink-0">
            {/* Popular Chapters */}
            <div className="space-y-2">
              <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 font-bold">Suggested Chapters</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => handleSuggestionClick(dest)}
                    className="px-3 py-1.5 bg-[#081A24] hover:bg-[#0C2533] text-[10px] font-semibold text-white/80 border border-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 font-bold">Recent Searches</span>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => setQuery(term)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#081A24] hover:bg-[#0C2533]/60 text-[10px] text-white/70 border border-white/10 rounded-lg cursor-pointer transition-colors group"
                    >
                      <Clock className="w-2.5 h-2.5 text-white/40" />
                      <span>{term}</span>
                      <button
                        onClick={(e) => removeRecentSearch(e, term)}
                        className="p-0.5 rounded-full hover:bg-white/10 text-white/40 hover:text-rose-400 shrink-0 ml-1 transition-colors"
                        aria-label={`Remove recent search ${term}`}
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Panel */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 min-h-[220px]">
          {isFiltering ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3 p-3 rounded-xl bg-[#081A24] animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/4 h-3 bg-white/10 rounded" />
                    <div className="w-3/4 h-4 bg-white/10 rounded" />
                    <div className="w-1/2 h-3 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : matchedTours.length > 0 ? (
            <div className="space-y-1">
              {query || selectedTag ? (
                <div className="px-2 py-1 text-left">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">Matched Chapters ({matchedTours.length})</span>
                </div>
              ) : null}
              {matchedTours.map((tour, index) => {
                const isFocused = index === focusedIndex;
                return (
                  <div
                    key={tour.id}
                    onClick={() => handleSelect(tour)}
                    className={`flex gap-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 text-left border ${
                      isFocused 
                        ? 'bg-[#081A24] border-[#148596]/30 shadow-sm' 
                        : 'bg-transparent border-transparent hover:bg-[#081A24]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0 relative">
                      <img 
                        src={tour.bannerImage} 
                        alt={tour.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                        loading="lazy" 
                        decoding="async" 
                        onError={e => { e.currentTarget.style.opacity = '0' }} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[9px] text-white/50 font-mono uppercase tracking-wider">
                        <MapPin className="w-2.5 h-2.5 text-[#148596]" />
                        <span>{tour.location}</span>
                      </div>
                      <p className={`text-xs font-semibold text-white truncate transition-colors ${isFocused ? 'text-[#148596]' : 'group-hover:text-[#148596]'}`}>{tour.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-[#FDB62F] fill-[#FDB62F]" />
                          <span className="text-[9px] font-bold text-white/60">{parseFloat(tour.rating.toFixed(1))}</span>
                        </div>
                        {tour.moods && tour.moods.length > 0 && (
                          <span className="text-[9px] font-mono text-white/40 uppercase">{tour.moods.slice(0, 1).join('')}</span>
                        )}
                        <span className="text-white/20">·</span>
                        <span className="text-[9px] font-mono text-white/40">{tour.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Compass className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/80 font-medium">No results found</p>
              <p className="text-xs text-white/50 mt-1">Try a different search term or mood tag.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40 font-mono uppercase tracking-wider shrink-0 bg-[#081A24]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FDB62F]" />
            <span>Search destinations</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-[#0C2533] border border-white/10 rounded text-[8px]">↑↓ navigate</span>
            <span className="px-1.5 py-0.5 bg-[#0C2533] border border-white/10 rounded text-[8px]">enter select</span>
            <span className="px-1.5 py-0.5 bg-[#0C2533] border border-white/10 rounded text-[8px]">esc close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
