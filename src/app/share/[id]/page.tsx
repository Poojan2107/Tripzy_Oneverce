import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSharedItineraryAction } from '../../../backend/actions/shareActions';
import { Compass, Calendar, MapPin, Sparkles, Navigation, DollarSign } from 'lucide-react';
import SharedMap from './SharedMap';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getSharedItineraryAction(id);
  const title = res.success && res.data
    ? `Shared Itinerary — ${res.data.title || 'Tripzy Journey'}`
    : 'Itinerary Not Found — Tripzy';
  const description = res.success && res.data
    ? `Explore this AI-crafted ${res.data.duration}-day itinerary for ${res.data.destination} — planned with Tripzy.`
    : 'This itinerary could not be found.';
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    robots: { index: false },
  };
}

export default async function SharePage(props: PageProps) {
  const { id } = await props.params;
  const res = await getSharedItineraryAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="w-full min-h-[100dvh] bg-background text-ink flex flex-col items-center justify-center p-6">
        <Compass className="w-12 h-12 text-gold animate-spin mb-4" />
        <h1 className="text-xl font-bold uppercase tracking-wider mb-2">Itinerary Not Found</h1>
        <p className="text-xs text-muted mb-6">This itinerary does not exist or has been deleted.</p>
        <Link href="/" className="px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light transition-all">
          Go to Home
        </Link>
      </div>
    );
  }

  const data = res.data;
  const itineraryDays = Array.isArray(data.itinerary) ? data.itinerary : [];
  
  const costs = (data as any).costs || {
    transit: 0,
    stay: 0,
    food: 0,
    total: data.budget || 0
  };

  return (
    <div className="w-full min-h-[100dvh] bg-background text-ink font-sans flex flex-col">
      <header className="w-full bg-surface border-b border-warm-gray/30 py-4 px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-night shadow-md">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-ink">Tripzy</span>
          </Link>
          <Link href="/" className="px-4 py-2 bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-night font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
            Plan A Trip
          </Link>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden max-w-7xl mx-auto w-full">
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100dvh-69px)] no-scrollbar">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Shared AI Companion Itinerary
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-night">
              {data.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-xs text-muted pt-2 border-t border-warm-gray/30">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="font-semibold text-ink">{data.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" />
                <span>{data.duration} Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-gold" />
                <span>Budget: ₹{costs.total?.toLocaleString() || 'Flexible'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted border-b border-warm-gray/30 pb-2">
              Itinerary Schedule
            </h2>

            {itineraryDays.map((day: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-cream border border-warm-gray/30 rounded-2xl p-5 hover:border-warm-gray/50 transition-all duration-300 relative group"
              >
                {day.latitude && day.longitude && (
                  <div className="absolute top-5 right-5 text-[9px] font-mono text-muted font-bold">
                    MAP POINT
                  </div>
                )}
                <h3 className="font-bold text-night text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-gold/10 border border-gold/20 text-gold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  {day.day}: {day.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed mb-4">
                  {day.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {day.activities?.map((act: string, aIdx: number) => (
                    <span 
                      key={aIdx} 
                      className="px-2.5 py-1 bg-surface text-muted text-[10px] font-semibold rounded-lg border border-warm-gray/30 flex items-center gap-1 hover:bg-warm-gray transition-colors"
                    >
                      <Navigation className="w-3 h-3 text-gold" /> {act}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cream border border-warm-gray/30 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Estimated Expenses
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-surface border border-warm-gray/30 p-3 rounded-xl">
                <span className="text-[9px] text-muted block uppercase font-bold">Transit</span>
                <span className="text-sm font-bold text-ink">₹{costs.transit?.toLocaleString() || '0'}</span>
              </div>
              <div className="bg-surface border border-warm-gray/30 p-3 rounded-xl">
                <span className="text-[9px] text-muted block uppercase font-bold">Stay</span>
                <span className="text-sm font-bold text-ink">₹{costs.stay?.toLocaleString() || '0'}</span>
              </div>
              <div className="bg-surface border border-warm-gray/30 p-3 rounded-xl">
                <span className="text-[9px] text-muted block uppercase font-bold">Food/Acts</span>
                <span className="text-sm font-bold text-ink">₹{costs.food?.toLocaleString() || '0'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-surface border border-gold/20 px-4 py-3 rounded-xl">
              <span className="text-xs font-bold uppercase text-muted">Total Budget Guide</span>
              <span className="text-lg font-black text-gold">₹{costs.total?.toLocaleString() || 'Flexible'}</span>
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/15 p-6 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-night uppercase">
              Inspired by this Journey?
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              Create your own luxury escape plan tailored precisely to your budget, travel style, and interests in seconds using Tripzy's AI Recommendation engine.
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-gold text-night font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light shadow-md active:scale-98 transition-all"
            >
              Build Your Own Plan
            </Link>
          </div>

        </div>

        <div className="lg:col-span-5 h-[400px] lg:h-[calc(100dvh-69px)] border-t lg:border-t-0 lg:border-l border-warm-gray/30 bg-surface overflow-hidden sticky bottom-0 lg:top-[69px]">
          <SharedMap itinerary={itineraryDays} />
        </div>
      </div>
    </div>
  );
}
