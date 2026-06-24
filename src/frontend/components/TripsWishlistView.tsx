"use client";
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Sparkles, Award, User, LogIn,
  Compass, BookOpen, Mountain, ArrowRight
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { Tour } from '../types';
import { TOURS_DATA } from '../data';
import { formatINR } from '../utils/currency';
import SafeImage from './ui/SafeImage';

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
    <motion.div
      onClick={onInspect}
      className="bg-surface border border-border p-5 pb-6 rounded-3xl cursor-pointer group flex flex-col justify-between text-left relative shadow-card hover:shadow-card-hover transition-all"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-secondary-surface mb-4">
        <SafeImage src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-muted hover:text-coral hover:bg-coral/10 shadow-sm border border-border cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        <span className="text-[8px] font-mono text-gold uppercase tracking-widest block font-bold">{tour.location}</span>
        <h3 className="font-display text-2xl text-night font-light leading-none lowercase group-hover:text-gold transition-colors">{tour.title}</h3>
        <p className="text-[11px] text-muted/80 font-light line-clamp-2 mt-1 leading-relaxed">{tour.subtitle}</p>
        <div className="pt-3 flex justify-between items-center text-xs font-bold text-night border-t border-border mt-3">
          <span>{formatINR(tour.price)}</span>
          <span className="text-[8px] font-mono font-bold text-coral bg-coral/10 border border-coral/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {tour.moods?.[0] || 'Wander'}
          </span>
        </div>
      </div>
    </motion.div>
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
      tag: "saved chapters",
      title: "no chapters saved yet",
      desc: "Your passport journal awaits your collected stories. Browse the atlas and save the destinations that speak to your soul.",
      btnText: "Explore Atlas",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-teal/40">
          <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3"/>
          <rect x="42" y="16" width="10" height="12" stroke="currentColor" strokeWidth="1.2" fill="rgba(24,182,201,0.05)"/>
          <circle cx="28" cy="32" r="10" fill="#18B6C9" fillOpacity={0.08} stroke="#18B6C9" strokeWidth={1.5}/>
          <circle cx="28" cy="32" r="7" stroke="#18B6C9" strokeWidth={0.75} strokeDasharray="2,2"/>
          <path d="M28 28C28 28 25.5 31.5 28 35.5C30.5 31.5 28 28 28 28Z" fill="#18B6C9" fillOpacity={0.25}/>
          <path d="M28 30.5C28 30.5 24 32 28 35C32 32 28 30.5 28 30.5Z" fill="#18B6C9" fillOpacity={0.25}/>
        </svg>
      )
    },
    itineraries: {
      tag: "journey chapters",
      title: "no journey chapters yet",
      desc: "Your travel companion can craft a custom journey for you. Set your travel style, pace, and destination to create your first journal chapter.",
      btnText: "Craft Journey",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-teal/35">
          <path d="M10 12H30V52H10C8.89543 52 8 51.1046 8 50V14C8 12.8954 8.89543 12 10 12Z" stroke="currentColor" strokeWidth={1.2}/>
          <path d="M54 12H34V52H54C55.1046 52 56 51.1046 56 50V14C56 12.8954 55.1046 12 54 12Z" stroke="currentColor" strokeWidth={1.2}/>
          <path d="M30 16H34M30 24H34M30 32H34M30 40H34M30 48H34" stroke="currentColor" strokeWidth={2}/>
          <circle cx="44" cy="32" r="8" stroke="currentColor" strokeWidth={0.75}/>
          <path d="M44 21V43M33 32H55" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2,2"/>
        </svg>
      )
    }
  }[type];

  return (
    <div className="text-center py-16 bg-white border border-warm-gray/50 rounded-[32px] max-w-lg mx-auto p-8 shadow-card relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-teal/[0.02] pointer-events-none" />
      
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#F8F4EE] rounded-2xl border border-warm-gray/50 transition-transform duration-500 hover:rotate-2">
        {content.illustration}
      </div>
      
      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gold block mb-2 font-bold animate-pulse">
        {content.tag}
      </span>
      <h3 className="font-display text-2.5xl font-light text-night lowercase leading-none mb-3">
        {content.title}
      </h3>
      <p className="text-[11px] text-muted/60 font-light max-w-xs mx-auto leading-relaxed font-sans mb-8">
        {content.desc}
      </p>
      
      <button
        onClick={onNavigate}
        className="px-6 py-3 bg-night text-white text-[9px] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-night/80 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 hover:scale-102 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
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

  const displayTours = useMemo(() => {
    return allTours.length > 0 ? allTours : TOURS_DATA;
  }, [allTours]);

  const checkedDestinationIds = useMemo(() => {
    const ids = new Set<string>();
    savedItineraries.forEach(i => {
      if (i.destination) {
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

  const badgesList = useMemo(() => {
    return [
      {
        id: 'first_journey',
        label: 'First Journey',
        desc: 'your first custom travel journal compiled',
        unlocked: savedItineraries.length > 0,
        icon: Compass,
      },
      {
        id: 'solo_explorer',
        label: 'Solo Explorer',
        desc: 'a solo expedition through the atlas',
        unlocked: savedItineraries.some(i => i.companions === 'solo'),
        icon: User,
      },
      {
        id: 'storyteller',
        label: 'Storyteller',
        desc: 'local chapters documented and saved',
        unlocked: wishlistTours.length >= 3,
        icon: BookOpen,
      },
      {
        id: 'early_bird',
        label: 'Early Bird',
        desc: 'registered member of the atlas',
        unlocked: !!session,
        icon: Sparkles,
      },
      {
        id: 'mountain_nomad',
        label: 'Mountain Nomad',
        desc: 'northern peaks explored and logged',
        unlocked: checkedDestinationIds.has('kashmir-meadows') || checkedDestinationIds.has('ladakh-passes'),
        icon: Mountain,
      },
      {
        id: 'heritage_hunter',
        label: 'Heritage Hunter',
        desc: 'historic centers visited across india',
        unlocked: checkedDestinationIds.has('varanasi-spiritual') || checkedDestinationIds.has('udaipur-mewar') || checkedDestinationIds.has('hampi-ruins'),
        icon: Award,
      },
    ];
  }, [savedItineraries, wishlistTours.length, checkedDestinationIds, session]);

  const explorerScore = useMemo(() => {
    return (savedItineraries.length * 150) + (wishlistTours.length * 50);
  }, [savedItineraries, wishlistTours]);

  return (
    <div className="pt-8 md:pt-10 pb-32 px-4 md:px-6 max-w-6xl mx-auto select-none bg-background text-night min-h-[100dvh] text-left animate-page-enter">
      
      {!session && (
        <div className="mb-6 p-4 rounded-3xl bg-surface border border-border flex items-center justify-between gap-4 shadow-sm">
          <p className="text-[10px] text-muted/65 font-light leading-relaxed">
            Sign in to sync your wishlist and itineraries across devices.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="shrink-0 px-4 py-2.5 rounded-full bg-night text-white text-[9px] font-bold uppercase tracking-wider hover:bg-night/80 transition-all cursor-pointer inline-flex items-center gap-1.5 min-h-[40px] shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT COLUMN: COMPACT PROFILE & BADGES ── */}
        <div className="md:col-span-4 space-y-6">
          {/* User Profile Card (Downscaled by 40% - No XP Bar) */}
          <div className="bg-surface border border-border rounded-3xl p-5 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-teal via-teal/70 to-gold p-0.5 shadow-sm relative">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface flex items-center justify-center">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || 'Avatar'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-secondary-surface flex items-center justify-center text-night/60 text-lg font-bold font-mono">
                      {session?.user?.name ? session.user.name[0].toUpperCase() : 'AV'}
                    </div>
                  )}
                </div>
              </div>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-teal font-bold block mt-3 mb-0.5">
                Explorer Passport
              </span>
              <h2 className="font-display text-2xl font-light text-night leading-tight truncate max-w-full lowercase">
                {session?.user?.name || "Guest Explorer"}
              </h2>
              <span className="text-[9px] font-mono text-muted/50 block lowercase mb-3">
                {session?.user?.email || "guest@tripzy.ai"}
              </span>

              <div className="grid grid-cols-3 gap-2 w-full text-center pt-3 border-t border-border">
                <div>
                  <span className="text-base font-mono font-bold text-night block leading-none">
                    {savedItineraries.length}
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted block mt-1">Journeys</span>
                </div>
                <div>
                  <span className="text-base font-mono font-bold text-gold block leading-none">
                    {wishlistTours.length}
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted block mt-1">Wishlist</span>
                </div>
                <div>
                  <span className="text-base font-mono font-bold text-coral block leading-none">
                    {badgesList.filter(b => b.unlocked).length}
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted block mt-1">Seals</span>
                </div>
              </div>

            </div>
          </div>

          {/* Collectible Seals Grid (Reduced size by 50% to support memories) */}
          <div className="bg-surface border border-border rounded-3xl p-5 shadow-card">
            <h3 className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted block mb-3.5 font-bold">
              travel passport seals
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {badgesList.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-2 py-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked 
                      ? 'bg-background border-border shadow-sm' 
                      : 'bg-secondary-surface/40 border-dashed border-border/60 opacity-30'
                  }`}
                >
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center relative mb-1.5 transition-all ${
                      badge.unlocked 
                        ? 'bg-gold/10 border border-gold/20' 
                        : 'border border-border bg-background'
                    }`}
                  >
                    <badge.icon className={`w-3.5 h-3.5 ${badge.unlocked ? 'text-gold' : 'text-muted/40'}`} />
                  </div>
                  <span className="text-[8px] font-bold text-night leading-tight block truncate w-full">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TIMELINE & SAVED CHAPTERS ── */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Vertical Travel Timeline (Main Emotional Feature) */}
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <BookOpen className="w-4 h-4 text-gold" />
              <h3 className="font-display text-xl text-night font-medium lowercase leading-none">travel timeline journal</h3>
            </div>
            
            <div className="relative pl-6 border-l border-border/80 space-y-6 pt-1">
              {/* 2026 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-surface" />
                <span className="font-mono text-[10px] font-bold text-muted">2026</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="bg-background border border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary-surface shrink-0">
                      <img src="/images/tours/varanasi-banner.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-night lowercase block truncate">varanasi, uttar pradesh</span>
                      <span className="text-[8px] font-mono text-muted uppercase tracking-wider block truncate">sacred ganga chapters</span>
                    </div>
                  </div>
                  <div className="bg-background border border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary-surface shrink-0">
                      <img src="/images/tours/kerala-banner.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-night lowercase block truncate">alleppey, kerala</span>
                      <span className="text-[8px] font-mono text-muted uppercase tracking-wider block truncate">backwater houseboat drift</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2025 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-teal border-2 border-surface" />
                <span className="font-mono text-[10px] font-bold text-muted">2025</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="bg-background border border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary-surface shrink-0">
                      <img src="/images/tours/ladakh-banner.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-night lowercase block truncate">leh, ladakh</span>
                      <span className="text-[8px] font-mono text-muted uppercase tracking-wider block truncate">high desert road trip</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2024 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-coral border-2 border-surface" />
                <span className="font-mono text-[10px] font-bold text-muted">2024</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="bg-background border border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary-surface shrink-0">
                      <img src="/images/tours/jaisalmer-banner.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-night lowercase block truncate">jaisalmer, rajasthan</span>
                      <span className="text-[8px] font-mono text-muted uppercase tracking-wider block truncate">thar desert stone dunes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Chapters Tab Switcher */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-secondary-surface p-1 rounded-2xl flex gap-1 border border-border relative">
                {['wishlist', 'itineraries'].map((tab) => {
                  const isActive = activeSubTab === tab;
                  const count = tab === 'wishlist' ? wishlistTours.length : savedItineraries.length;
                  return (
                    <button key={tab} onClick={() => setActiveSubTab(tab as any)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer min-h-[34px] shrink-0 relative ${
                        isActive ? 'text-white shadow-sm' : 'text-muted hover:text-night'
                      }`}
                    >
                      {isActive && (
                        <motion.span className="absolute inset-0 rounded-xl bg-night"
                          layoutId="subTabActive2" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                      )}
                      <span className="relative z-10">{tab === 'wishlist' ? 'Saved' : 'Chapters'}</span>
                      {count > 0 && (
                        <motion.span className="relative z-10 h-4 min-w-4 rounded-full bg-coral text-[8px] font-bold text-white flex items-center justify-center px-1"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                          {count}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeSubTab === 'wishlist' && (
              <div className="animate-scale-in">
                {wishlistTours.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
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

            {activeSubTab === 'itineraries' && (
              <div className="animate-scale-in">
                {savedItineraries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedItineraries.map((itin: any) => {
                      const tour = displayTours.find(t => t.id === itin.destination || t.dbId === itin.destination) || TOURS_DATA.find(t => t.id === itin.destination);
                      const bannerImage = tour?.bannerImage || '/images/tours/varanasi-banner.jpg';
                      const durationDays = itin.duration || 5;
                      const companionLabel = itin.companions === 'solo' ? 'Solo Explorer' : itin.companions === 'couple' ? 'Couple Escape' : itin.companions === 'family' ? 'Family Journey' : itin.companions === 'friends' ? 'Group Expedition' : 'Explorer';
                      const chaptersCount = durationDays;
                      const storiesCount = durationDays * 2 + 3;

                      return (
                        <div 
                          key={itin.id}
                          onClick={() => onInspectItinerary && onInspectItinerary(itin)}
                          className="relative rounded-3xl overflow-hidden group shadow-card hover:shadow-card-hover border border-border transition-all duration-300 h-64 cursor-pointer flex flex-col justify-between p-6"
                        >
                          <div className="absolute inset-0 z-0">
                            <SafeImage src={bannerImage} alt={itin.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-10" />
                          </div>

                          <div className="flex justify-between items-start z-20 relative">
                            <div className="flex gap-2">
                              <span className="text-[8px] font-mono font-bold text-night bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider border border-border">
                                {durationDays} Days
                              </span>
                              <span className="text-[8px] font-mono font-bold text-gold bg-gold/15 border border-gold/30 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {companionLabel}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDeleteItinerary(itin.id); }}
                              className="w-9 h-9 rounded-full bg-surface/95 backdrop-blur-md flex items-center justify-center text-muted hover:text-coral hover:bg-coral/10 border border-border cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="z-20 relative text-left">
                            <div className="flex items-center gap-1 text-[8px] font-mono text-gold uppercase tracking-[0.2em] font-bold mb-1">
                              <Sparkles className="w-3 h-3 text-gold animate-pulse" />
                              <span>Companion Journal</span>
                            </div>
                            <h3 className="font-display text-2xl text-night font-light lowercase leading-tight group-hover:text-gold transition-colors line-clamp-1 mb-2">
                              {itin.title || 'Untitled Itinerary'}
                            </h3>
                            <div className="flex justify-between items-center text-[10px] text-muted font-mono uppercase tracking-wider pt-2 border-t border-border">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-teal" />
                                {chaptersCount} Chapters · {storiesCount} Stories
                              </span>
                              <span className="flex items-center gap-1 text-teal font-bold group-hover:text-gold transition-colors">
                                View Journey
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyPassportState type="itineraries" onNavigate={onNavigatePlanner || onNavigateExplore} />
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}