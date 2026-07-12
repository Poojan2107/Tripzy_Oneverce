"use client";
import { useMemo } from 'react';
import { 
  Compass, User, BookOpen, Sparkles, Mountain, Award, Lock 
} from 'lucide-react';
import { Tour } from '../../types';

interface TravelSealsProps {
  wishlistTours: Tour[];
  savedItineraries: any[];
  checkedDestinationIds: Set<string>;
  session: any;
}

export default function TravelSeals({
  wishlistTours,
  savedItineraries,
  checkedDestinationIds,
  session
}: TravelSealsProps) {
  
  // Travel Badges Progress helper
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

  // Compute badges list
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

  return (
    <div className="bg-surface border border-border/70 rounded-2xl p-6 md:p-8 shadow-md">
      <div className="flex items-center gap-2 pb-3 border-b border-border/15 mb-5 text-left">
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
  );
}
