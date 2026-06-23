"use client";
import { useState, useMemo, useEffect } from 'react';
import { 
  Trash2, Sparkles, Award, User, LogIn,
  Compass, BookOpen, Mountain, ArrowRight
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
      className="bg-[#0C2533] border border-white/10 p-4 pb-5 rounded-[24px] shadow-sm hover:shadow-card hover:border-gold/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left relative"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 mb-3.5">
        <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-[#E6355A] hover:bg-[#E6355A]/20 shadow-sm border border-white/10 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1.5">
        <span className="text-[8px] font-mono text-gold uppercase tracking-widest block font-bold">{tour.location.split(',')[0]}</span>
        <h3 className="font-display text-2xl text-white font-light leading-none lowercase group-hover:text-[#FDB62F] transition-colors">{tour.title}</h3>
        <p className="text-[10px] text-[#8FA0AB] font-light line-clamp-2 mt-0.5 leading-relaxed">{tour.subtitle}</p>
        <div className="pt-2 flex justify-between items-center text-xs font-bold text-white border-t border-white/5 mt-2">
          <span>{formatINR(tour.price)}</span>
          <span className="text-[8px] font-mono font-bold text-[#E6355A] bg-[#E6355A]/10 border border-[#E6355A]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {tour.moods?.[0] || 'Wander'}
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
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[#148596]/30">
          <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3"/>
          <rect x="42" y="16" width="10" height="12" stroke="currentColor" strokeWidth="1.2" fill="rgba(20,133,150,0.05)"/>
          <circle cx="28" cy="32" r="10" fill="#148596" fillOpacity={0.1} stroke="#148596" strokeWidth={1.5}/>
          <circle cx="28" cy="32" r="7" stroke="#148596" strokeWidth={0.75} strokeDasharray="2,2"/>
          <path d="M28 28C28 28 25.5 31.5 28 35.5C30.5 31.5 28 28 28 28Z" fill="#148596" fillOpacity={0.3}/>
          <path d="M28 30.5C28 30.5 24 32 28 35C32 32 28 30.5 28 30.5Z" fill="#148596" fillOpacity={0.3}/>
        </svg>
      )
    },
    itineraries: {
      tag: "custom logs",
      title: "no custom chapters compiled",
      desc: "Our intelligent journey builder stands ready to map customized itineraries. Calibrate companions, budget levels, and rhythms to save your first journal map.",
      btnText: "Launch Journey Builder",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[#148596]/25">
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
    <div className="text-center py-16 bg-[#0C2533]/40 border border-[#148596]/20 rounded-[32px] max-w-lg mx-auto p-8 shadow-soft relative overflow-hidden paper-grain w-full">
      <div className="absolute inset-0 bg-radial-gradient(circle, rgba(20,133,150,0.03) 0%, transparent 100%) pointer-events-none" />
      
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#0C2533] rounded-2xl border border-white/10 transition-transform duration-500 hover:rotate-2">
        {content.illustration}
      </div>
      
      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gold block mb-2 font-bold animate-pulse">
        {content.tag}
      </span>
      <h3 className="font-display text-2.5xl font-light text-white lowercase leading-none mb-3">
        {content.title}
      </h3>
      <p className="text-[11px] text-[#8FA0AB] font-light max-w-xs mx-auto leading-relaxed font-sans mb-8">
        {content.desc}
      </p>
      
      <button
        onClick={onNavigate}
        className="px-6 py-3 bg-gradient-to-r from-[#148596] to-[#286F98] text-white text-[9px] font-bold uppercase tracking-[0.18em] rounded-full hover:shadow-[0_0_15px_rgba(20,133,150,0.4)] transition-all duration-300 cursor-pointer inline-flex items-center gap-2 hover:scale-102"
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

  // Dynamic Badge Checklist showing collectible seals
  const badgesList = useMemo(() => {
    return [
      {
        id: 'first_journey',
        label: 'First Journey',
        desc: 'unlocked by compiling your first custom log',
        unlocked: savedItineraries.length > 0,
        icon: Compass,
      },
      {
        id: 'solo_explorer',
        label: 'Solo Explorer',
        desc: 'unlocked by mapping a solo expedition',
        unlocked: savedItineraries.some(i => i.companions === 'solo'),
        icon: User,
      },
      {
        id: 'storyteller',
        label: 'Storyteller',
        desc: 'unlocked by documenting local chapters',
        unlocked: wishlistTours.length >= 3,
        icon: BookOpen,
      },
      {
        id: 'early_bird',
        label: 'Early Bird',
        desc: 'awarded to registered members',
        unlocked: !!session,
        icon: Sparkles,
      },
      {
        id: 'mountain_nomad',
        label: 'Mountain Nomad',
        desc: 'unlocked by exploring northern peaks',
        unlocked: checkedDestinationIds.has('kashmir-meadows') || checkedDestinationIds.has('ladakh-passes'),
        icon: Mountain,
      },
      {
        id: 'heritage_hunter',
        label: 'Heritage Hunter',
        desc: 'unlocked by visiting historic centers',
        unlocked: checkedDestinationIds.has('varanasi-spiritual') || checkedDestinationIds.has('udaipur-mewar') || checkedDestinationIds.has('hampi-ruins'),
        icon: Award,
      },
    ];
  }, [savedItineraries, wishlistTours.length, checkedDestinationIds, session]);

  // Traveler Profile score and level calculations
  const explorerScore = useMemo(() => {
    return (savedItineraries.length * 150) + (wishlistTours.length * 50);
  }, [savedItineraries, wishlistTours]);

  const explorerLevel = useMemo(() => {
    return Math.max(1, Math.floor(explorerScore / 500) + 1);
  }, [explorerScore]);

  const levelProgress = useMemo(() => {
    return (explorerScore % 500) / 5;
  }, [explorerScore]);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setAnimatedProgress(levelProgress);
    }, 150);
    return () => clearTimeout(t);
  }, [levelProgress]);

  return (
    <div className="pt-8 md:pt-10 pb-32 px-4 md:px-6 max-w-6xl mx-auto select-none bg-[#07131A] text-white min-h-[100dvh] text-left animate-page-enter">
      
      {!session && (
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-[#148596]/10 to-[#E6355A]/5 border border-[#148596]/20 flex items-center justify-between gap-4">
          <p className="text-[10px] text-[#8FA0AB] font-light leading-relaxed">
            Sign in to sync your wishlist and itineraries across devices.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="shrink-0 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#148596] to-[#286F98] text-white text-[9px] font-bold uppercase tracking-wider hover:opacity-90 hover:scale-102 transition-all cursor-pointer inline-flex items-center gap-1.5 min-h-[40px]"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* ── LEFT COLUMN: USER PROFILE CARD ── */}
        <div className="md:col-span-4 bg-gradient-to-b from-[#0C2533] to-[#081A24] border border-white/10 rounded-[32px] p-6 shadow-soft relative overflow-hidden paper-grain animate-fade-in">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#148596]/15 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col items-center text-center">
            {/* Portrait/Avatar frame with glowing rings */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#148596] via-[#286F98] to-[#FDB62F] p-0.5 shadow-[0_0_15px_rgba(20,133,150,0.3)] relative group">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C2533] flex items-center justify-center">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0C2533] to-[#081A24] flex items-center justify-center text-white text-xl font-bold font-mono">
                    AV
                  </div>
                )}
              </div>
            </div>

            {/* Profile details */}
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#148596] font-bold block mt-4 mb-1">
              Active Passport
            </span>
            <h2 className="font-display text-3xl font-light text-white leading-tight">
              {session?.user?.name || "Guest Explorer"}
            </h2>
            <span className="text-[10px] font-mono text-[#8FA0AB]/70 block lowercase mb-4">
              {session?.user?.email || "guest@tripzy.ai"}
            </span>

            <div className="w-full h-px bg-white/5 my-4" />

            {/* Rank Capsule */}
            <div className="bg-[#148596]/10 border border-[#148596]/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-5 hover:scale-103 transition-transform duration-300">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                {explorerLevel >= 10 ? 'Master Explorer' : explorerLevel >= 5 ? 'Elite Wanderer' : explorerLevel >= 3 ? 'Trailblazer' : 'Journey Starter'}
              </span>
            </div>

            {/* Progress representation */}
            <div className="w-full text-left space-y-1.5">
              <div className="flex justify-between items-end text-[9px] font-mono">
                <span className="text-[#8FA0AB]">Level {explorerLevel}</span>
                <span className="text-gold font-bold">{explorerScore.toLocaleString()} XP</span>
              </div>
              
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#148596] via-[#286F98] to-[#FDB62F] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(253,182,47,0.6)] animate-pulse"
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-[#8FA0AB]/50">
                <span>Voyager Tier</span>
                <span>{Math.max(0, Math.floor(500 - (explorerScore % 500)))} XP to next level</span>
              </div>
            </div>

            <div className="w-full h-px bg-white/5 my-4" />

            {/* Micro counters */}
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              <div>
                <span className="text-lg font-mono font-bold text-white block leading-none">
                  {savedItineraries.length}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#8FA0AB]/60 block mt-1">Journeys</span>
              </div>
              <div>
                <span className="text-lg font-mono font-bold text-gold block leading-none">
                  {wishlistTours.length}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#8FA0AB]/60 block mt-1">Wishlist</span>
              </div>
              <div>
                <span className="text-lg font-mono font-bold text-[#E6355A] block leading-none">
                  {badgesList.filter(b => b.unlocked).length}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#8FA0AB]/60 block mt-1">Seals</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT COLUMN: BADGES & JOURNAL LIST ── */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Collectible Seals Grid */}
          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8FA0AB] block mb-4 font-bold">
              collectible travel seals
            </h3>
            {badgesList.filter(b => b.unlocked).length === 0 && (
              <div className="mb-6 p-6 py-7 rounded-[28px] bg-[#0C2533]/40 border border-dashed border-[#148596]/30 text-center space-y-4 max-w-md mx-auto shadow-inner paper-grain">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1 font-bold">Passport Seals</span>
                  <h4 className="font-display text-xl text-white font-light lowercase">No seals unlocked yet</h4>
                  <p className="text-[10px] text-[#8FA0AB] font-light leading-relaxed mt-1 font-sans">
                    Your digital passport is blank. Unlock collectible travel seals and gain XP by creating a tripzy account, building custom itineraries, or exploring chapters!
                  </p>
                </div>
                <button
                  onClick={onNavigateExplore}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#148596] to-[#286F98] text-white text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:scale-102 border-none"
                >
                  Explore Chapters
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badgesList.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                    badge.unlocked 
                      ? 'bg-gradient-to-b from-[#0C2533] to-[#0A1E29] border-[#148596]/30 shadow-[0_0_15px_rgba(20,133,150,0.15)] group' 
                      : 'bg-[#0C2533]/30 border-dashed border-white/5 opacity-35'
                  }`}
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center relative mb-2.5 transition-all duration-500 ${
                      badge.unlocked 
                        ? 'bg-gradient-to-tr from-[#148596]/20 to-[#FDB62F]/10 border border-[#FDB62F]/40 shadow-[0_0_10px_rgba(253,182,47,0.2)] group-hover:rotate-12 group-hover:scale-110' 
                        : 'border border-white/10'
                    }`}
                  >
                    {badge.unlocked && <div className="absolute inset-0 rounded-full bg-radial-gradient(circle, rgba(253,182,47,0.15) 0%, transparent 100%) pointer-events-none animate-pulse-slow" />}
                    <badge.icon className={`w-5 h-5 ${badge.unlocked ? 'text-[#FDB62F]' : 'text-slate-600'}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white leading-snug line-clamp-1">
                    {badge.label}
                  </span>
                  <span className="text-[9px] text-[#8FA0AB] font-light mt-0.5 leading-tight">
                    {badge.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Sub tabs and Grid selection */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-[#0C2533] p-1 rounded-2xl flex gap-1 border border-white/5">
                <button
                  onClick={() => setActiveSubTab('wishlist')}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer min-h-[38px] shrink-0 ${
                    activeSubTab === 'wishlist'
                      ? 'bg-gradient-to-r from-[#148596] to-[#286F98] text-white shadow-md'
                      : 'text-[#8FA0AB]/60 hover:text-white'
                  }`}
                >
                  <span>Wishlist</span>
                  {wishlistTours.length > 0 && (
                    <span className="h-4 min-w-4 rounded-full bg-[#E6355A] text-[8px] font-bold text-white flex items-center justify-center px-1">
                      {wishlistTours.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveSubTab('itineraries')}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer min-h-[38px] shrink-0 ${
                    activeSubTab === 'itineraries'
                      ? 'bg-gradient-to-r from-[#148596] to-[#286F98] text-white shadow-md'
                      : 'text-[#8FA0AB]/60 hover:text-white'
                  }`}
                >
                  <span>Itineraries</span>
                  {savedItineraries.length > 0 && (
                    <span className="h-4 min-w-4 rounded-full bg-[#E6355A] text-[8px] font-bold text-white flex items-center justify-center px-1">
                      {savedItineraries.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Curated Wishlist Panel */}
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

            {/* AI Itineraries Panel (Saved Journals) */}
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
                          className="relative rounded-[28px] overflow-hidden group shadow-md hover:shadow-card-hover border border-white/10 hover:border-gold/30 transition-all duration-300 h-64 cursor-pointer flex flex-col justify-between p-6"
                        >
                          {/* Background image */}
                          <div className="absolute inset-0 z-0">
                            <img src={bannerImage} alt={itin.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07131A] via-[#07131A]/60 to-transparent z-10" />
                          </div>

                          {/* Card Top Details */}
                          <div className="flex justify-between items-start z-20 relative">
                            <div className="flex gap-2">
                              <span className="text-[8px] font-mono font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {durationDays} Days
                              </span>
                              <span className="text-[8px] font-mono font-bold text-[#FDB62F] bg-[#FDB62F]/10 border border-[#FDB62F]/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {companionLabel}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDeleteItinerary(itin.id); }}
                              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-[#E6355A] hover:bg-[#E6355A]/20 border border-white/10 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Card Bottom Details */}
                          <div className="z-20 relative text-left">
                            <div className="flex items-center gap-1 text-[8px] font-mono text-gold uppercase tracking-[0.2em] font-bold mb-1">
                              <Sparkles className="w-3 h-3 text-gold" />
                              <span>AI Compiled Journal</span>
                            </div>
                            <h3 className="font-display text-3xl text-white font-light lowercase leading-tight group-hover:text-[#FDB62F] transition-colors line-clamp-1 mb-2">
                              {itin.title || 'Untitled Itinerary'}
                            </h3>
                            <div className="flex justify-between items-center text-[10px] text-[#8FA0AB] font-mono uppercase tracking-wider pt-2 border-t border-white/10">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#148596]" />
                                {chaptersCount} Chapters · {storiesCount} Stories
                              </span>
                              <span className="flex items-center gap-1 text-[#148596] font-bold group-hover:text-gold transition-colors">
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
