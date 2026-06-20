import { useEffect, useState, useMemo, useRef } from 'react';
import { Search, X, Star, MapPin, Compass } from 'lucide-react';
import { Tour } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

const QUICK_TAGS = ['Adventure', 'Relaxation', 'Luxury', 'Food', 'Culture', 'Nature'];

export default function SearchModal({
  isOpen,
  onClose,
  tours,
  onSelectTour
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query || selectedTag) {
      setIsFiltering(true);
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        setIsFiltering(false);
        const activeTerm = selectedTag || query.trim();
        if (activeTerm && activeTerm.length >= 3) {
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'search', payload: { query: activeTerm } })
          }).catch(() => {});
        }
      }, 300);
    } else {
      setIsFiltering(false);
    }
    return () => { if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current); };
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

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setQuery('');
    } else {
      setSelectedTag(tag);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedTag) setSelectedTag(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div onClick={onClose} className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm transition-opacity duration-200" />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-elevated border border-warm-gray/40 relative z-10 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Search input */}
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input
              type="text"
              autoFocus
              placeholder="Search destinations, moods, activities..."
              value={query}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-warm-mist text-deep-navy text-sm rounded-xl border border-warm-gray/40 outline-none focus:border-ocean/40 focus:ring-2 focus:ring-ocean/10 transition-all duration-200 placeholder:text-stone"
            />
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {QUICK_TAGS.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-ocean text-white border-ocean'
                      : 'bg-white text-charcoal/60 border-warm-gray/40 hover:border-ocean/30 hover:text-ocean'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto px-4 pb-4 space-y-1">
          {isFiltering ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3 p-3 rounded-xl bg-warm-mist animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-warm-gray shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/4 h-3 bg-warm-gray rounded" />
                    <div className="w-3/4 h-4 bg-warm-gray rounded" />
                    <div className="w-1/2 h-3 bg-warm-gray rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : matchedTours.length > 0 ? (
            matchedTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => { onSelectTour(tour); onClose(); }}
                className="flex gap-3 p-3 rounded-xl hover:bg-warm-mist cursor-pointer group transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-gray shrink-0">
                  <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.opacity = '0' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-charcoal/50">
                    <MapPin className="w-2.5 h-2.5 text-ocean" />
                    <span>{tour.location}</span>
                  </div>
                  <p className="text-xs font-semibold text-deep-navy truncate group-hover:text-ocean transition-colors">{tour.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-sunset fill-sunset" />
                      <span className="text-[10px] text-charcoal/60">{tour.rating}</span>
                    </div>
                    {tour.moods && tour.moods.length > 0 && (
                      <span className="text-[9px] text-charcoal/40">{tour.moods.slice(0, 2).join(' · ')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <Compass className="w-8 h-8 text-stone mx-auto mb-2" />
              <p className="text-sm text-deep-navy font-medium">No results found</p>
              <p className="text-xs text-charcoal/50 mt-1">Try a different search term or mood.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-warm-gray/20 flex items-center justify-between text-[10px] text-charcoal/40">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-ocean" />
            <span>Search destinations</span>
          </span>
          <span className="px-2 py-0.5 bg-warm-mist rounded text-[9px]">esc</span>
        </div>
      </div>
    </div>
  );
}
