import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSharedPassportAction } from '../../../../backend/actions/userActions';
import { Compass, BookOpen, Mountain, Award, User, Sparkles, ArrowRight, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getSharedPassportAction(id);
  const title = res.success && res.data
    ? `Explorer Passport — ${res.data.name || 'Traveler'}`
    : 'Passport Not Found — Travebie';
  const description = res.success && res.data
    ? `Explore the living travel logs, chapters, and collections of ${res.data.name || 'Traveler'} on Travebie.`
    : 'This explorer passport could not be found.';
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    robots: { index: false },
  };
}

export default async function SharedPassportPage(props: PageProps) {
  const { id } = await props.params;
  const res = await getSharedPassportAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="w-full min-h-[100dvh] bg-background text-night flex flex-col items-center justify-center p-6 select-none">
        <Compass className="w-12 h-12 text-gold animate-spin mb-4" />
        <h1 className="text-xl font-display font-light lowercase mb-2">passport not found</h1>
        <p className="text-xs text-muted mb-6">This explorer passport does not exist or has been made private.</p>
        <Link href="/" className="px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold/90 transition-all">
          Go to Home
        </Link>
      </div>
    );
  }

  const user = res.data;
  const itineraries = Array.isArray(user.savedItineraries) ? user.savedItineraries : [];
  
  const wishlistTours = user.bookmarks.map((b: any) => {
    const d = b.destination;
    const imagesArray = Array.isArray(d.images) ? d.images : [];
    const moodsArray = Array.isArray(d.moods) ? d.moods : [];
    return {
      id: d.slug || d.id,
      dbId: d.id,
      title: d.name,
      subtitle: d.description.slice(0, 85) + '...',
      description: d.description,
      location: `${d.city}, ${d.country}`,
      bannerImage: imagesArray[0] || '/images/tours/varanasi-banner.jpg',
      category: d.featured ? 'popular' : 'trending',
      moods: moodsArray.map((m: any) => m.mood?.name).filter(Boolean),
    };
  });

  const checkedDestinationIds = new Set<string>();
  itineraries.forEach((i: any) => {
    if (i.destination) {
      const destLower = i.destination.toLowerCase();
      if (destLower.includes('varanasi')) checkedDestinationIds.add('varanasi-spiritual');
      else if (destLower.includes('kerala')) checkedDestinationIds.add('kerala-houseboats');
      else if (destLower.includes('ladakh')) checkedDestinationIds.add('ladakh-passes');
      else if (destLower.includes('kashmir')) checkedDestinationIds.add('kashmir-meadows');
      else if (destLower.includes('jaisalmer')) checkedDestinationIds.add('jaisalmer-fort');
      else if (destLower.includes('udaipur')) checkedDestinationIds.add('udaipur-mewar');
      else if (destLower.includes('munnar')) checkedDestinationIds.add('munnar-tea');
      else if (destLower.includes('goa')) checkedDestinationIds.add('goa-beach');
      else if (destLower.includes('hampi')) checkedDestinationIds.add('hampi-ruins');
      else if (destLower.includes('kutch')) checkedDestinationIds.add('kutch-salt');
      else if (destLower.includes('cherrapunji')) checkedDestinationIds.add('cherrapunji-roots');
      else if (destLower.includes('andaman')) checkedDestinationIds.add('andaman-reefs');
    }
  });

  const badgesList = [
    {
      id: 'first_journey',
      label: 'First Journey',
      desc: 'collected travel journal',
      unlocked: itineraries.length > 0,
      icon: Compass,
    },
    {
      id: 'solo_explorer',
      label: 'Solo Explorer',
      desc: 'solo expedition through the atlas',
      unlocked: itineraries.some((i: any) => i.companions === 'solo'),
      icon: User,
    },
    {
      id: 'storyteller',
      label: 'Storyteller',
      desc: 'local chapters documented',
      unlocked: wishlistTours.length >= 3,
      icon: BookOpen,
    },
    {
      id: 'early_bird',
      label: 'Early Bird',
      desc: 'registered in the atlas',
      unlocked: true,
      icon: Sparkles,
    },
    {
      id: 'mountain_nomad',
      label: 'Mountain Nomad',
      desc: 'northern peaks explored',
      unlocked: checkedDestinationIds.has('kashmir-meadows') || checkedDestinationIds.has('ladakh-passes'),
      icon: Mountain,
    },
    {
      id: 'heritage_hunter',
      label: 'Heritage Hunter',
      desc: 'historic centers visited',
      unlocked: checkedDestinationIds.has('varanasi-spiritual') || checkedDestinationIds.has('udaipur-mewar') || checkedDestinationIds.has('hampi-ruins'),
      icon: Award,
    },
  ];

  const explorerSince = user.createdAt 
    ? new Date(user.createdAt).getFullYear() 
    : '2026';

  return (
    <div className="w-full min-h-[100dvh] bg-background text-night font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="w-full bg-white border-b border-border/30 py-4 px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-row">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-night shadow-md">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-night lowercase">travebie<span className="text-gold">.ai</span></span>
          </Link>
          <Link href="/" className="px-4 py-2 bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-night font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
            Plan A Trip
          </Link>
        </div>
      </header>

      <main className="pt-8 md:pt-10 px-4 md:px-6 max-w-5xl mx-auto w-full select-none text-left space-y-10">
        
        {/* ── 1. PASSPORT HERO ── */}
        <div className="relative bg-white border border-border/40 rounded-3xl p-7 md:p-10 shadow-card overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal/5 to-transparent rounded-tr-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-teal via-teal/70 to-gold p-0.5 shadow-sm shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                {user.image ? (
                  <img src={user.image} alt={user.name || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-night/60 text-xl font-bold font-mono">
                    {user.name ? user.name[0].toUpperCase() : 'AV'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-teal font-bold block mb-1">Explorer Passport</span>
              <h1 className="font-display text-3xl md:text-4xl text-night font-light lowercase leading-tight">
                {user.name || "Guest Explorer"}
              </h1>
              <span className="text-[10px] font-mono text-muted/50 block lowercase mt-0.5">
                Explorer Since {explorerSince} · Public Read-only Passport
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 shrink-0">
              <div className="text-center">
                <span className="block font-display text-2xl font-light text-night leading-none">{itineraries.length}</span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-0.5">Journeys</span>
              </div>
              <div className="text-center">
                <span className="block font-display text-2xl font-light text-gold leading-none">{wishlistTours.length}</span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-0.5">Saved</span>
              </div>
              <div className="text-center">
                <span className="block font-display text-2xl font-light text-coral leading-none">
                  {new Set(wishlistTours.map((t: any) => t.location.split(',')[1]?.trim())).size || 0}
                </span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-0.5">Regions</span>
              </div>
              <div className="text-center hidden md:block">
                <span className="block font-display text-2xl font-light text-teal leading-none">{badgesList.filter(b => b.unlocked).length}</span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-0.5">Seals</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. TRAVEL SEALS ── */}
        <div className="bg-white border border-border/40 rounded-3xl p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-2 pb-3 border-b border-border/20 mb-5">
            <Award className="w-4 h-4 text-teal" />
            <h3 className="font-display text-xl text-night font-light lowercase leading-none">travel seals</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {badgesList.map((badge) => (
              <div key={badge.id}
                className={`p-4 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-white border-border/50 shadow-sm'
                    : 'bg-border/20 border-dashed border-border/40 opacity-30 select-none'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center relative mb-3 ${
                  badge.unlocked
                    ? 'bg-gradient-to-tr from-gold/15 via-gold/5 to-white border-2 border-gold/30 shadow-inner'
                    : 'border border-dashed border-border bg-white'
                }`}>
                  {badge.unlocked && (
                    <div className="absolute inset-1 rounded-full border border-dashed border-gold/25 pointer-events-none" />
                  )}
                  <badge.icon className={`w-6 h-6 ${badge.unlocked ? 'text-gold drop-shadow-sm' : 'text-muted/40'}`} />
                </div>
                
                <span className="text-[10px] font-bold text-night leading-tight block w-full">{badge.label}</span>
                <span className="text-[7.5px] font-mono text-muted/60 uppercase tracking-wider block mt-1 line-clamp-1 w-full">{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. JOURNEY COLLECTION ── */}
        {itineraries.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <h3 className="font-display text-xl text-night font-light lowercase leading-none">journey collection</h3>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {itineraries.map((itin: any) => {
                const durationDays = itin.duration || 5;
                const companionLabel = itin.companions === 'solo' ? 'Solo Explorer' : itin.companions === 'couple' ? 'Couple Escape' : itin.companions === 'family' ? 'Family Journey' : 'Explorer';
                return (
                  <Link key={itin.id} href={`/share/${itin.id}`}
                    className="relative rounded-3xl overflow-hidden group shadow-card hover:shadow-card-hover border border-border/40 transition-all duration-300 min-h-[200px] flex flex-col justify-between p-6 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <span className="text-[8px] font-mono font-bold text-night bg-background px-2.5 py-1 rounded-full uppercase tracking-wider border border-border/40">{durationDays} Days</span>
                        <span className="text-[8px] font-mono font-bold text-gold bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-full uppercase tracking-wider">{companionLabel}</span>
                      </div>
                    </div>
                    <div className="text-left mt-6">
                      <div className="flex items-center gap-1 text-[8px] font-mono text-gold uppercase tracking-[0.2em] font-bold mb-1">
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span>Companion Journal</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl text-night font-light lowercase leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-2">
                        {itin.title || 'Untitled Itinerary'}
                      </h3>
                      <div className="flex justify-between items-center text-[9px] text-muted font-mono uppercase tracking-wider pt-2 border-t border-border/20">
                        <span className="flex items-center gap-1.5 flex-row">
                          <BookOpen className="w-3 h-3 text-teal" />
                          {durationDays} Chapters
                        </span>
                        <span className="flex items-center gap-1 text-teal font-bold group-hover:text-gold transition-colors">
                          View <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 4. SAVED CHAPTERS ── */}
        {wishlistTours.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold" />
              <h3 className="font-display text-xl text-night font-light lowercase leading-none">saved chapters</h3>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistTours.map((tour: any) => (
                <div key={tour.id} className="bg-white border border-border/40 p-5 pb-6 rounded-3xl flex flex-col justify-between text-left shadow-card">
                  <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-background mb-4">
                    <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-gold uppercase tracking-widest block font-bold">{tour.location}</span>
                    <h3 className="font-display text-2xl text-night font-light leading-none lowercase">{tour.title}</h3>
                    <p className="text-[11px] text-muted/80 font-light line-clamp-2 mt-1 leading-relaxed">{tour.subtitle}</p>
                    <div className="pt-3 flex justify-between items-center text-xs font-bold text-night border-t border-border/20 mt-3">
                      <span className="text-[8px] font-mono font-bold text-teal bg-teal/10 border border-teal/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {tour.moods?.[0] || 'Explore'}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {tour.category || 'Chapter'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
