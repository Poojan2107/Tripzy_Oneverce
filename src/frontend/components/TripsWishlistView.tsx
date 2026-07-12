"use client";
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Sparkles, Award, User, LogIn, Lock,
  Compass, BookOpen, Mountain, ArrowRight
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { Tour } from '../types';
import { TOURS_DATA } from '../data';
import { formatINR } from '../utils/currency';
import SafeImage from './ui/SafeImage';
import { useToast } from './ui/Toast';
import ScrapbookPostcard from './passport/ScrapbookPostcard';
import EmptyPassportState from './passport/EmptyPassportState';

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
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'chapters' | 'journeys'>('chapters');

  const displayTours = useMemo(() => {
    return allTours.length > 0 ? allTours : TOURS_DATA;
  }, [allTours]);

  // Determine Checked Locations
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

  // Calculate Enhanced Stats
  const daysTraveled = useMemo(() => {
    return savedItineraries.reduce((sum, itin) => sum + (itin.duration || 5), 0);
  }, [savedItineraries]);

  const regionsExplored = useMemo(() => {
    const regions = new Set<string>();
    wishlistTours.forEach(t => {
      if (t.location && typeof t.location === 'string') {
        const parts = t.location.split(',');
        const region = parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim();
        if (region) regions.add(region);
      }
    });
    savedItineraries.forEach(itin => {
      const tour = displayTours.find(t => t.id === itin.destination || t.dbId === itin.destination) || TOURS_DATA.find(t => t.id === itin.destination);
      if (tour && tour.location && typeof tour.location === 'string') {
        const parts = tour.location.split(',');
        const region = parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim();
        if (region) regions.add(region);
      }
    });
    return regions.size;
  }, [wishlistTours, savedItineraries, displayTours]);

  // Compute Travel Preferences Badges
  const preferences = useMemo(() => {
    if (savedItineraries.length === 0) return null;

    // Companion
    const compCounts: Record<string, number> = {};
    savedItineraries.forEach(i => {
      const c = i.companions || 'solo';
      compCounts[c] = (compCounts[c] || 0) + 1;
    });
    const topCompanion = Object.entries(compCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'solo';
    const companionLabel = topCompanion === 'solo' ? 'Solo Nomad' : topCompanion === 'couple' ? 'Romantic Duo' : topCompanion === 'family' ? 'Family Clan' : 'Group Explorers';

    // Duration style
    const avgDuration = Math.round(savedItineraries.reduce((sum, i) => sum + (i.duration || 5), 0) / savedItineraries.length);
    const durationLabel = avgDuration <= 3 ? 'Weekend Resets' : avgDuration <= 7 ? 'Mid-length Odysseys' : 'Extended Journeys';

    // Budget
    const avgBudget = Math.round(savedItineraries.reduce((sum, i) => sum + (i.budget || 15000), 0) / savedItineraries.length);
    const budgetLabel = avgBudget <= 15000 ? 'Explorer Budgets' : avgBudget <= 40000 ? 'Curated Comfort' : 'Floating Oases';

    return {
      companion: companionLabel,
      duration: durationLabel,
      budget: budgetLabel,
      avgDuration,
      avgBudget
    };
  }, [savedItineraries]);

  // Travel Badges Progress
  const getBadgeProgress = (badgeId: string) => {
    switch (badgeId) {
      case 'first_journey':
        return {
          current: savedItineraries.length,
          target: 1,
          label: `${savedItineraries.length}/1 journeys`
        };
      case 'storyteller':
        return {
          current: wishlistTours.length,
          target: 3,
          label: `${wishlistTours.length}/3 chapters`
        };
      case 'mountain_nomad':
        const mountainCount = (checkedDestinationIds.has('kashmir-meadows') ? 1 : 0) + (checkedDestinationIds.has('ladakh-passes') ? 1 : 0);
        return {
          current: mountainCount,
          target: 2,
          label: `${mountainCount}/2 peaks`
        };
      case 'heritage_hunter':
        const heritageCount = (checkedDestinationIds.has('varanasi-spiritual') ? 1 : 0) + (checkedDestinationIds.has('udaipur-mewar') ? 1 : 0) + (checkedDestinationIds.has('hampi-ruins') ? 1 : 0);
        return {
          current: heritageCount,
          target: 3,
          label: `${heritageCount}/3 heritage`
        };
      default:
        return null;
    }
  };

  const badgesList = useMemo(() => {
    return [
      {
        id: 'first_journey',
        label: 'First Journey',
        desc: 'collected travel journal',
        lockedDesc: 'save 1 itinerary',
        unlocked: savedItineraries.length > 0,
        icon: Compass,
      },
      {
        id: 'solo_explorer',
        label: 'Solo Explorer',
        desc: 'solo expedition through the atlas',
        lockedDesc: 'travel as a solo nomad',
        unlocked: savedItineraries.some(i => i.companions === 'solo'),
        icon: User,
      },
      {
        id: 'storyteller',
        label: 'Storyteller',
        desc: 'local chapters documented',
        lockedDesc: 'wishlist 3 chapters',
        unlocked: wishlistTours.length >= 3,
        icon: BookOpen,
      },
      {
        id: 'early_bird',
        label: 'Early Bird',
        desc: 'registered in the atlas',
        lockedDesc: 'sign in to passport',
        unlocked: !!session,
        icon: Sparkles,
      },
      {
        id: 'mountain_nomad',
        label: 'Mountain Nomad',
        desc: 'northern peaks explored',
        lockedDesc: 'explore kashmir or ladakh',
        unlocked: checkedDestinationIds.has('kashmir-meadows') || checkedDestinationIds.has('ladakh-passes'),
        icon: Mountain,
      },
      {
        id: 'heritage_hunter',
        label: 'Heritage Hunter',
        desc: 'historic centers visited',
        lockedDesc: 'explore varanasi, udaipur or hampi',
        unlocked: checkedDestinationIds.has('varanasi-spiritual') || checkedDestinationIds.has('udaipur-mewar') || checkedDestinationIds.has('hampi-ruins'),
        icon: Award,
      },
    ];
  }, [savedItineraries, wishlistTours.length, checkedDestinationIds, session]);

  // Group Itineraries by Year dynamically
  const timelineGroups = useMemo(() => {
    const groups: Record<number, any[]> = {};
    savedItineraries.forEach(itin => {
      let date = new Date();
      if (itin.createdAt) {
        date = new Date(itin.createdAt);
      } else if (itin.id && typeof itin.id === 'string' && itin.id.startsWith('local-')) {
        const ts = parseInt(itin.id.split('-')[1]);
        if (!isNaN(ts)) date = new Date(ts);
      }
      const year = date.getFullYear();
      if (!groups[year]) groups[year] = [];
      
      const tour = displayTours.find(t => t.id === itin.destination || t.dbId === itin.destination) || TOURS_DATA.find(t => t.id === itin.destination);
      groups[year].push({
        ...itin,
        date,
        location: tour?.location || 'India',
        chapterName: tour?.chapterName || 'Chapter',
        bannerImage: tour?.bannerImage || '/images/tours/varanasi-banner.jpg'
      });
    });

    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        items: groups[year].sort((a, b) => b.date.getTime() - a.date.getTime())
      }));
  }, [savedItineraries, displayTours]);

  return (
    <div className="pt-24 md:pt-28 pb-32 px-4 md:px-6 max-w-6xl mx-auto select-none bg-background text-night min-h-[100dvh] text-left animate-page-enter">

      {!session && (
        <div className="mb-6 p-4 rounded-lg bg-surface border border-border/70 flex items-center justify-between gap-4 shadow-sm">
          <p className="text-meta text-muted/65 font-light leading-relaxed">
            Sign in to sync your Passport across devices.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="btn btn-night h-10 px-4 rounded-md text-caption inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </div>
      )}
 
      {/* ── 1. PASSPORT HERO ── */}
      <div className="relative mb-10 bg-surface border border-border/70 rounded-2xl p-8 md:p-10 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal/5 to-transparent rounded-tr-full pointer-events-none" />
 
        <div className="flex flex-col gap-8 relative z-10 w-full">
          {/* Top row: Profile & Share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/15">
            <div className="flex items-center gap-4.5 text-left">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-teal via-teal/70 to-gold p-0.5 shadow-sm shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface flex items-center justify-center">
                  {session?.user?.image ? (
                    <SafeImage
                      src={session.user.image}
                      alt={session.user.name || 'Avatar'}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-secondary-surface flex items-center justify-center text-night/60 text-xl font-bold font-mono">
                      {session?.user?.name ? session.user.name[0].toUpperCase() : 'AV'}
                    </div>
                  )}
                </div>
              </div>
     
              <div>
                <span className="text-meta font-mono text-teal block mb-1">Explorer Passport</span>
                <h1 className="font-display text-heading text-night font-light lowercase leading-tight">
                  {session?.user?.name || "Guest Explorer"}
                </h1>
                <span className="text-meta font-mono text-muted/50 block lowercase mt-0.5">
                  Explorer Since 2026 · {session?.user?.email || "guest@tripzy.ai"}
                </span>
              </div>
            </div>

            {session?.user?.id && (
              <button
                onClick={() => {
                  const url = `${window.location.origin}/passport/share/${session.user.id}`;
                  navigator.clipboard.writeText(url);
                  toast("Passport link copied to clipboard!", "copy");
                }}
                className="btn btn-outline border-teal/20 bg-teal/5 text-teal hover:bg-teal/10 h-10 px-4 rounded-md text-caption flex items-center justify-center cursor-pointer shadow-sm self-start sm:self-center shrink-0"
              >
                Share Passport
              </button>
            )}
          </div>
 
          {/* Bottom row: Enhanced Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            <div className="text-center bg-background/50 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold/30">
              <span className="block font-display text-3xl font-light text-night leading-none">{savedItineraries.length}</span>
              <span className="text-meta font-mono text-muted/60 block mt-2 uppercase tracking-wider">Journeys</span>
            </div>
            <div className="text-center bg-background/50 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold/30">
              <span className="block font-display text-3xl font-light text-gold leading-none">{wishlistTours.length}</span>
              <span className="text-meta font-mono text-muted/60 block mt-2 uppercase tracking-wider">Saved Chapters</span>
            </div>
            <div className="text-center bg-background/50 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold/30">
              <span className="block font-display text-3xl font-light text-coral leading-none">{regionsExplored}</span>
              <span className="text-meta font-mono text-muted/60 block mt-2 uppercase tracking-wider">Regions</span>
            </div>
            <div className="text-center bg-background/50 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold/30">
              <span className="block font-display text-3xl font-light text-teal leading-none">{daysTraveled}</span>
              <span className="text-meta font-mono text-muted/60 block mt-2 uppercase tracking-wider">Days Traveled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Split layout: Left logs, Right visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
        
        {/* Left Side: Timeline Journal & Seals (col-span-2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Dynamic Travel Timeline */}
          <div className="bg-surface border border-border/70 rounded-2xl p-6 md:p-8 shadow-md space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/15">
               <BookOpen className="w-4 h-4 text-gold" />
               <h3 className="font-display text-section text-night font-light lowercase leading-none">travel timeline journal</h3>
            </div>
 
            {timelineGroups.length > 0 ? (
              <div className="relative pl-8 border-l-2 border-border/60 space-y-8 pt-2">
                {timelineGroups.map((group) => (
                  <div key={group.year} className="relative">
                    <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-gold border-[2px] border-surface shadow-sm" />
                    <span className="font-display text-section text-night font-light block leading-none mb-3">{group.year}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.map((item) => (
                        <div key={item.id} className="bg-background border border-border/70 p-3.5 rounded-xl flex items-center gap-3 hover:shadow-sm transition-shadow shadow-sm">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-surface shrink-0 relative">
                            <SafeImage src={item.bannerImage} alt={item.title} className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-body font-bold text-night lowercase block truncate">{item.title || 'Untitled Journey'}</span>
                            <span className="text-meta font-mono text-muted block truncate">{item.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body text-muted/50 font-light italic py-6 text-center">
                Your travel timeline is currently empty. Plan a journey to record your first milestone.
              </p>
            )}
          </div>
 
          {/* Travel Seals (collected badges) */}
          <div className="bg-surface border border-border/70 rounded-2xl p-6 md:p-8 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-border/15 mb-5">
              <Award className="w-4 h-4 text-teal" />
               <h3 className="font-display text-section text-night font-light lowercase leading-none">travel seals — collected artifacts</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badgesList.map((badge) => (
                <div key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 relative group overflow-hidden ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-white to-[#FFFDF9]/80 border-border shadow-sm hover:shadow-md hover:border-gold/50 cursor-pointer'
                      : 'bg-secondary-surface/40 border-dashed border-border/60 select-none'
                  }`}
                >
                  {badge.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-teal/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                  
                  {!badge.unlocked && (
                    <div className="absolute inset-0 bg-night/95 backdrop-blur-xs p-3 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none select-none z-10 text-center">
                      <Lock className="w-4 h-4 text-gold mb-1 animate-pulse" />
                      <span className="text-[9px] font-mono text-gold/80 uppercase tracking-widest block mb-0.5">lock criteria</span>
                      <p className="text-[10px] text-white/70 font-light leading-relaxed max-w-[130px]">{badge.lockedDesc}</p>
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center relative mb-3 transition-all duration-500 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-gold/15 via-gold/5 to-surface border-2 border-gold/30 shadow-inner group-hover:scale-110 group-hover:rotate-6'
                      : 'border border-dashed border-border bg-background'
                  }`}>
                    {badge.unlocked && (
                      <div className="absolute inset-1 rounded-full border border-dashed border-gold/25 pointer-events-none" />
                    )}
                    <badge.icon className={`w-5 h-5 ${badge.unlocked ? 'text-gold drop-shadow-sm' : 'text-muted/30'}`} />
                  </div>
                  
                  <span className="text-meta font-bold text-night leading-tight block w-full">{badge.label}</span>
                  
                  {badge.unlocked ? (
                    <span className="text-meta font-mono text-gold block mt-1 line-clamp-1 w-full">{badge.desc}</span>
                  ) : (
                    <div className="w-full mt-1.5 space-y-1 opacity-70">
                      <span className="text-[10px] font-mono text-muted/65 block line-clamp-1 w-full">{badge.lockedDesc}</span>
                      {getBadgeProgress(badge.id) && (
                        <div className="w-full bg-secondary-surface h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-gold h-full transition-all duration-350" 
                            style={{ width: `${Math.min(100, (getBadgeProgress(badge.id)!.current / getBadgeProgress(badge.id)!.target) * 100)}%` }} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Map & Preferences (col-span-1) */}
        <div className="space-y-6">
          
          {/* Destination Map Card - removed */}
 
          {/* Travel Preferences Card */}
          <div className="bg-surface border border-border/70 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/15">
              <Sparkles className="w-4 h-4 text-gold" />
              <h4 className="font-display text-section text-night font-light lowercase leading-none">travel preferences</h4>
            </div>
            {preferences ? (
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center py-2 border-b border-border/15">
                  <span className="text-meta text-muted">style cadence</span>
                  <span className="font-bold text-night bg-secondary-surface px-2.5 py-0.5 rounded-sm text-meta font-mono">{preferences.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/15">
                  <span className="text-meta text-muted">fellowship mode</span>
                  <span className="font-bold text-gold bg-gold/10 px-2.5 py-0.5 rounded-sm text-meta font-mono">{preferences.companion}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-meta text-muted">average budget</span>
                  <span className="font-bold text-teal bg-teal/10 px-2.5 py-0.5 rounded-sm text-meta font-mono">{preferences.budget}</span>
                </div>
              </div>
            ) : (
              <p className="text-meta text-muted/50 font-light italic text-center py-4">Preferences will form as you plan journeys.</p>
            )}
          </div>

        </div>

      </div>

      {/* ── 2. SAVED CHAPTERS / COLLECTION TABS ── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            <h3 className="font-display text-section text-night font-light lowercase leading-none">saved chapters</h3>
          </div>
          <div className="bg-secondary-surface p-0.5 rounded-md flex gap-0.5 border border-border/70 relative">
            {['chapters', 'journeys'].map((tab) => {
              const isActive = activeSubTab === tab;
              const count = tab === 'chapters' ? wishlistTours.length : savedItineraries.length;
              return (
                <button key={tab} onClick={() => setActiveSubTab(tab as any)}
                  className={`px-4 py-2 btn-ghost text-meta font-mono uppercase flex items-center gap-2 cursor-pointer min-h-[44px] shrink-0 relative ${
                    isActive ? 'text-white shadow-sm font-bold' : 'text-muted hover:text-night'
                  }`}
                >
                  {isActive && (
                    <motion.span className="absolute inset-0 rounded-md bg-night"
                      layoutId="subTabActive" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                  )}
                  <span className="relative z-10">{tab === 'chapters' ? 'Saved Chapters' : 'Journey Collection'}</span>
                  {count > 0 && (
                    <motion.span className="relative z-10 h-4 min-w-4 rounded-full bg-coral text-micro font-bold text-white flex items-center justify-center px-1"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                      {count}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
 
        {activeSubTab === 'chapters' && (
          <div className="animate-scale-in">
            {wishlistTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <AnimatePresence mode="popLayout">
                  {wishlistTours.map((tour) => (
                      <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <ScrapbookPostcard
                        tour={tour}
                        onRemove={() => onRemoveWishlist(tour.id)}
                        onInspect={() => onTourSelect(tour)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyPassportState type="wishlist" onNavigate={onNavigateExplore} />
            )}
          </div>
        )}
 
        {activeSubTab === 'journeys' && (
          <div className="animate-scale-in">
            {savedItineraries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {savedItineraries.map((itin: any) => {
                    const tour = displayTours.find(t => t.id === itin.destination || t.dbId === itin.destination) || TOURS_DATA.find(t => t.id === itin.destination);
                    const bannerImage = tour?.bannerImage || '/images/tours/varanasi-banner.jpg';
                    const durationDays = itin.duration || 5;
                    return (
                      <motion.div key={itin.id} onClick={() => onInspectItinerary?.(itin)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative rounded-lg overflow-hidden group shadow-md border border-border/70 transition-all duration-300 min-h-[260px] cursor-pointer flex flex-col justify-between p-5"
                      >
                        <div className="absolute inset-0 z-0">
                          <SafeImage src={bannerImage} alt={itin.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-10" />
                        </div>
                        <div className="flex justify-between items-start z-20 relative">
                          <span className="text-meta font-mono font-bold text-night bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-sm uppercase border border-border/70">{durationDays} Days</span>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteItinerary(itin.id); }}
                            aria-label="Delete itinerary"
                            className="btn-ghost w-8 h-8 flex items-center justify-center text-muted hover:text-coral cursor-pointer">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="z-20 relative text-left">
                          <div className="flex items-center gap-1 text-meta font-mono text-gold mb-1">
                            <Sparkles className="w-3 h-3 text-gold" />
                            <span>Companion Journal</span>
                          </div>
                          <h3 className="font-display text-card text-night font-light lowercase leading-tight group-hover:text-gold transition-colors line-clamp-1">{itin.title || 'Untitled Itinerary'}</h3>
                          <div className="flex justify-between items-center text-meta text-muted font-mono uppercase pt-2 mt-2 border-t border-border/15">
                            <span className="flex items-center gap-1 text-teal font-bold group-hover:text-gold transition-colors">
                              View <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyPassportState type="itineraries" onNavigate={onNavigatePlanner || onNavigateExplore} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}