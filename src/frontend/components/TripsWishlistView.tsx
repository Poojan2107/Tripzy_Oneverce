"use client";
import { useState, useMemo } from 'react';
import { 
  MapPin, Trash2, 
  Sparkles, Clock, Award, User, LogIn
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { Tour } from '../types';
import { TOURS_DATA } from '../data';
import { formatINR } from '../utils/currency';

interface TripsWishlistViewProps {
  wishlistTours: Tour[];
  savedItineraries: any[];
  onTourSelect: (tour: Tour) => void;
  onRemoveWishlist: (tourId: string) => void;
  onNavigateExplore: () => void;
  onNavigatePlanner?: () => void;
  onDeleteItinerary: (id: string) => void;
  onInspectItinerary?: (itin: any) => void;
  allTours?: Tour[];
}

function ScrapbookPostcard({ tour, onRemove, onInspect }: { tour: Tour; onRemove: () => void; onInspect: () => void; }) {
  return (
    <div 
      onClick={onInspect}
      className="bg-white p-4 pb-6 rounded-3xl border bg-cream shadow-sm hover:shadow-md hover:border-gold/35 transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left relative"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream mb-4">
        <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm border bg-cream cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        <span className="text-[8px] font-mono text-gold uppercase tracking-widest block">{tour.location.split(',')[0]}</span>
        <h3 className="font-display text-2xl text-night font-light leading-none lowercase">{tour.title}</h3>
        <p className="text-xs text-muted/60 font-light line-clamp-2 mt-1 leading-relaxed">{tour.subtitle}</p>
        <div className="pt-2 flex justify-between items-center text-xs font-bold text-night">
          <span>{formatINR(tour.price)}</span>
          <span className="text-[9px] font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {tour.moods?.[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyPassportState({ 
  onNavigate, 
  type 
}: { 
  onNavigate: () => void; 
  type: 'wishlist' | 'itineraries'; 
}) {
  const content = {
    wishlist: {
      tag: "curated desires",
      title: "your catalog of desires is empty",
      desc: "Like an uncollected scrapbook, this space awaits your curated chapters. Browse the atlas and click the heart on destinations that speak to your soul.",
      btnText: "Explore Atlas",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gold/30">
          <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3,3"/>
          <rect x="42" y="16" width="10" height="12" stroke="currentColor" stroke-width="1.2" fill="rgba(214,168,95,0.05)"/>
          <circle cx="28" cy="32" r="10" fill="#D6A85F" fill-opacity="0.1" stroke="#D6A85F" stroke-width="1.5"/>
          <circle cx="28" cy="32" r="7" stroke="#D6A85F" stroke-width="0.75" stroke-dasharray="2,2"/>
          <path d="M28 28C28 28 25.5 31.5 28 35.5C30.5 31.5 28 28 28 28Z" fill="#D6A85F" fill-opacity="0.3"/>
          <path d="M28 30.5C28 30.5 24 32 28 35C32 32 28 30.5 28 30.5Z" fill="#D6A85F" fill-opacity="0.3"/>
        </svg>
      )
    },
    itineraries: {
      tag: "custom logs",
      title: "no custom chapters compiled",
      desc: "Our intelligent journey builder stands ready to map customized itineraries. Calibrate companions, budget levels, and rhythms to save your first journal map.",
      btnText: "Launch Journey Builder",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gold/25">
          <path d="M10 12H30V52H10C8.89543 52 8 51.1046 8 50V14C8 12.8954 8.89543 12 10 12Z" stroke="currentColor" stroke-width="1.2"/>
          <path d="M54 12H34V52H54C55.1046 52 56 51.1046 56 50V14C56 12.8954 55.1046 12 54 12Z" stroke="currentColor" stroke-width="1.2"/>
          <path d="M30 16H34M30 24H34M30 32H34M30 40H34M30 48H34" stroke="currentColor" stroke-width="2"/>
          <circle cx="44" cy="32" r="8" stroke="currentColor" stroke-width="0.75"/>
          <path d="M44 21V43M33 32H55" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2,2"/>
        </svg>
      )
    }
  }[type];

  return (
    <div className="text-center py-20 bg-cream/40 border border-gold/25 rounded-[32px] max-w-lg mx-auto p-8 shadow-soft relative overflow-hidden bg-topo-pattern animate-fade-in w-full">
      <div className="absolute inset-0 bg-radial-gradient(circle, rgba(214,168,95,0.03) 0%, transparent 100%) pointer-events-none" />
      
      {/* Editorial Stamp/Watermark Wrapper */}
      <div className="relative w-22 h-22 mx-auto mb-6 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(30,41,59,0.04)] bg-white rounded-2xl border border-warm-gray/60 transition-transform duration-500 hover:rotate-2">
        {content.illustration}
      </div>
      
      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-saffron block mb-2 font-bold animate-pulse">
        {content.tag}
      </span>
      <h3 className="font-display text-2.5xl font-light text-night lowercase leading-none mb-3">
        {content.title}
      </h3>
      <p className="text-[11px] text-night/60 font-light max-w-xs mx-auto leading-relaxed font-sans mb-8">
        {content.desc}
      </p>
      
      <button
        onClick={onNavigate}
        className="px-6 py-3 bg-night text-white text-[9px] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-saffron transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-md hover:scale-102"
      >
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        <span>{content.btnText}</span>
      </button>
    </div>
  );
}

export default function TripsWishlistView({
  wishlistTours,
  savedItineraries = [],
  onTourSelect,
  onRemoveWishlist,
  onNavigateExplore,
  onNavigatePlanner,
  onDeleteItinerary,
  onInspectItinerary,
  allTours = []
}: TripsWishlistViewProps) {
  const { data: session } = useSession();
  const [activeSubTab, setActiveSubTab] = useState<'wishlist' | 'itineraries'>('wishlist');

  const getDestinationPrettyName = (destId: string | null | undefined, list?: Tour[]): string => {
    if (!destId) return 'Curated Destination';
    
    // Try finding in list (dynamic database results)
    if (list && list.length > 0) {
      const tour = list.find(t => t.id === destId || t.dbId === destId);
      if (tour) return tour.title;
    }
    
    // Try finding in static TOURS_DATA
    const staticTour = TOURS_DATA.find(t => t.id === destId || t.dbId === destId);
    if (staticTour) return staticTour.title;
    
    // Try splitting slug
    if (destId.includes('-')) {
      const part = destId.split('-')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    
    return destId;
  };

  // List of all destinations saved
  const checkedDestinationIds = useMemo(() => {
    const ids = new Set<string>();
    savedItineraries.forEach(i => {
      if (i.destination) {
        // Find matching tour id
        if (i.destination.includes('varanasi')) ids.add('varanasi-spiritual');
        else if (i.destination.includes('kerala')) ids.add('kerala-houseboats');
        else if (i.destination.includes('ladakh')) ids.add('ladakh-passes');
        else if (i.destination.includes('kashmir')) ids.add('kashmir-meadows');
        else if (i.destination.includes('jaisalmer')) ids.add('jaisalmer-fort');
        else if (i.destination.includes('udaipur')) ids.add('udaipur-mewar');
        else if (i.destination.includes('munnar')) ids.add('munnar-tea');
        else if (i.destination.includes('goa')) ids.add('goa-beach');
        else if (i.destination.includes('hampi')) ids.add('hampi-ruins');
        else if (i.destination.includes('kutch')) ids.add('kutch-salt');
        else if (i.destination.includes('cherrapunji')) ids.add('cherrapunji-roots');
        else if (i.destination.includes('andaman')) ids.add('andaman-reefs');
      }
    });
    return ids;
  }, [savedItineraries]);

  // Dynamic Badge Checklist
  const badgesList = useMemo(() => {
    const checkBadge = (destIds: string[]) => destIds.some(id => checkedDestinationIds.has(id));
    return [
      { id: 'ganga', label: 'Ganga Pilgrim', desc: 'Varanasi', unlocked: checkBadge(['varanasi-spiritual']), color: '#E07B39' },
      { id: 'mountain', label: 'Mountain Nomad', desc: 'Ladakh or Kashmir', unlocked: checkBadge(['ladakh-passes', 'kashmir-meadows']), color: '#B71C1C' },
      { id: 'desert', label: 'Desert Wanderer', desc: 'Jaisalmer or Kutch', unlocked: checkBadge(['jaisalmer-fort', 'kutch-salt']), color: '#D84315' },
      { id: 'backwater', label: 'Backwater Explorer', desc: 'Kerala Houseboats', unlocked: checkBadge(['kerala-houseboats']), color: '#00B0FF' },
      { id: 'heritage', label: 'Heritage Hunter', desc: 'Hampi or Udaipur', unlocked: checkBadge(['hampi-ruins', 'udaipur-mewar']), color: '#C1573A' },
      { id: 'tea', label: 'Tea Valley Collector', desc: 'Munnar or Cherrapunji', unlocked: checkBadge(['munnar-tea', 'cherrapunji-roots']), color: '#004D40' },
    ];
  }, [checkedDestinationIds]);

  // Journey Score calculation (max 100 for basic MVP)
  const journeyScore = useMemo(() => {
    const score = (savedItineraries.length * 15) + (wishlistTours.length * 5);
    return Math.min(score, 100) || 10; // Default baseline score
  }, [savedItineraries, wishlistTours]);

  return (
    <div className="pt-8 md:pt-10 pb-32 px-4 md:px-6 max-w-6xl mx-auto select-none bg-sand min-h-[100dvh] text-left animate-page-enter">

      {!session && (
        <div className="mb-6 p-3 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-between gap-3">
          <p className="text-[10px] text-muted/70 font-light leading-relaxed">
            Sign in to sync your wishlist and itineraries across devices.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-night text-white text-[8px] font-bold uppercase tracking-wider hover:bg-saffron transition-all cursor-pointer inline-flex items-center gap-1.5 min-h-[44px]"
          >
            <LogIn className="w-3 h-3" />
            Sign In
          </button>
        </div>
      )}
      
      {/* ── PASSPORT DASHBOARD PANEL ── */}
      <div className="mb-8 md:mb-10 p-4 md:p-6 bg-white border bg-cream rounded-3xl shadow-sm space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-night flex items-center justify-center text-white shrink-0">
              <User className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[8px] font-mono text-gold uppercase tracking-[0.25em] block leading-none mb-1">
                Active Passport
              </span>
              <h2 className="font-display text-3xl font-light text-night lowercase leading-none">
                Citizen of India
              </h2>
            </div>
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 text-center">
            <div className="px-2 md:px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-saffron leading-none">
                {journeyScore}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Journey Score</span>
            </div>
            <div className="px-2 md:px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-gold leading-none">
                {checkedDestinationIds.size}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Chapters</span>
            </div>
            <div className="px-2 md:px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-night leading-none">
                {badgesList.filter(b => b.unlocked).length}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Badges</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-cream" />

        {/* Badges Gallery */}
        <div>
          <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 block mb-4 font-bold">
            travel badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {badgesList.map((badge) => (
              <div 
                key={badge.id}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${
                  badge.unlocked 
                    ? 'bg-white bg-cream shadow-sm hover:shadow-card hover:-translate-y-0.5 hover:rotate-1' 
                    : 'bg-warm-white/40 bg-cream/20 border-dashed opacity-40'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: badge.unlocked ? `${badge.color}15` : '#ECE6DA40', color: badge.unlocked ? badge.color : '#94A3B8' }}
                >
                  <Award className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-bold text-night leading-snug line-clamp-1">
                  {badge.label}
                </span>
                <span className="text-[8px] text-muted/50 font-light mt-0.5">
                  {badge.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab selectors */}
      <div className="flex justify-start mb-8 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        <div className="bg-white border bg-cream p-1.5 rounded-2xl flex gap-1 shadow-sm min-w-max">
          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`px-4 md:px-5 py-3 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer min-h-[44px] shrink-0 ${
              activeSubTab === 'wishlist'
                ? 'bg-night text-white shadow-sm'
                : 'text-muted/60 hover:text-night'
            }`}
          >
            <span>Wishlist</span>
            {wishlistTours.length > 0 && (
              <span className="h-4.5 min-w-4.5 rounded-full bg-gold text-[8px] font-bold text-white flex items-center justify-center px-1">
                {wishlistTours.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('itineraries')}
            className={`px-4 md:px-5 py-3 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer min-h-[44px] shrink-0 ${
              activeSubTab === 'itineraries'
                ? 'bg-night text-white shadow-sm'
                : 'text-muted/60 hover:text-night'
            }`}
          >
            <span>Itineraries</span>
            {savedItineraries.length > 0 && (
              <span className="h-4.5 min-w-4.5 rounded-full bg-gold text-[8px] font-bold text-white flex items-center justify-center px-1">
                {savedItineraries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Curated Wishlist Panel */}
      {activeSubTab === 'wishlist' && (
        <div>
          {wishlistTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {wishlistTours.map((tour) => (
                <ScrapbookPostcard
                  key={tour.id}
                  tour={tour}
                  onRemove={() => onRemoveWishlist(tour.id)}
                  onInspect={() => onTourSelect(tour)}
                />
              ))}
            </div>
          ) : (
            <EmptyPassportState type="wishlist" onNavigate={onNavigateExplore} />
          )}
        </div>
      )}

      {/* AI Itineraries Panel (Saved Journals) */}
      {activeSubTab === 'itineraries' && (
        <div className="space-y-4">
          {savedItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItineraries.map((itin: any) => (
                <div 
                  key={itin.id}
                  onClick={() => onInspectItinerary && onInspectItinerary(itin)}
                  className="p-6 rounded-[28px] bg-white border bg-cream shadow-sm flex items-start justify-between cursor-pointer hover:border-gold/50 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Accent border highlight */}
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gold/30" />
                  
                  <div className="flex-1 min-w-0 pr-4 pl-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-gold group-hover:animate-pulse" />
                      <span className="text-[8px] font-mono text-gold uppercase tracking-widest font-bold">Saved Itinerary</span>
                    </div>
                    <h3 className="font-display font-light text-2xl text-night group-hover:text-saffron transition-colors leading-tight">
                      {itin.title || 'Untitled Itinerary'}
                    </h3>
                    <div className="flex items-center gap-3.5 mt-2.5 text-[9px] text-muted/60 font-mono uppercase tracking-wider font-bold">
                      {itin.destination && (
                        <span className="flex items-center gap-1 bg-warm-white px-2.5 py-1 rounded-xl border bg-cream">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {getDestinationPrettyName(itin.destination, allTours)}
                        </span>
                      )}
                      {itin.duration && (
                        <span className="flex items-center gap-1 bg-warm-white px-2.5 py-1 rounded-xl border bg-cream">
                          <Clock className="w-3.5 h-3.5 text-sage" />
                          {itin.duration} Days
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteItinerary(itin.id); }}
                    className="w-11 h-11 rounded-full bg-warm-white flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 shrink-0 cursor-pointer border bg-cream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPassportState type="itineraries" onNavigate={onNavigatePlanner || onNavigateExplore} />
          )}
        </div>
      )}

    </div>
  );
}
