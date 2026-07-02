import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, Clock, Users, IndianRupee } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ dest?: string; days?: string; budget?: string; travelers?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const dest = params.dest || 'destination';
  return {
    title: `Shared Journey — ${dest.charAt(0).toUpperCase() + dest.slice(1)} | Travebie`,
    description: `Explore this AI-crafted ${params.days || '?'}-day itinerary for ${dest}.`,
    robots: { index: false },
  };
}

export default async function SharedQueryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dest = params.dest || 'varanasi';
  const days = params.days || '5';
  const budget = params.budget || '25000';
  const travelers = params.travelers || 'solo';

  return (
    <div className="w-full min-h-[100dvh] bg-background text-night font-sans flex flex-col">
      <header className="w-full bg-surface border-b border-border/30 py-4 px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold" />
            <span className="font-logo text-lg font-bold tracking-tight lowercase">travebie<span className="text-gold">.ai</span></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <Compass className="w-14 h-14 text-gold animate-spin-slow mb-6" />
        <h1 className="font-display text-3xl font-light text-night lowercase tracking-tight mb-3">
          shared <span className="text-gold">{dest}</span> odyssey
        </h1>
        <p className="text-muted/70 font-light mb-8 max-w-sm leading-relaxed">
          This journey was crafted with Travebie AI. Open it in the Companion to view the full day-by-day itinerary, cost breakdown, and route map.
        </p>

        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <div className="bg-surface border border-border/70 rounded-xl p-4">
            <Clock className="w-4 h-4 text-gold mx-auto mb-1.5" />
            <span className="text-sm font-bold text-night block">{days} Days</span>
            <span className="text-micro font-mono text-muted/60 uppercase tracking-wider">Duration</span>
          </div>
          <div className="bg-surface border border-border/70 rounded-xl p-4">
            <IndianRupee className="w-4 h-4 text-gold mx-auto mb-1.5" />
            <span className="text-sm font-bold text-night block">₹{Number(budget).toLocaleString('en-IN')}</span>
            <span className="text-micro font-mono text-muted/60 uppercase tracking-wider">Budget</span>
          </div>
          <div className="bg-surface border border-border/70 rounded-xl p-4">
            <Users className="w-4 h-4 text-gold mx-auto mb-1.5" />
            <span className="text-sm font-bold text-night block capitalize">{travelers}</span>
            <span className="text-micro font-mono text-muted/60 uppercase tracking-wider">Travelers</span>
          </div>
        </div>

        <Link
          href="/"
          className="btn btn-night px-8 py-3 rounded-lg text-caption font-bold tracking-wider inline-flex items-center gap-2 shadow-md"
        >
          <Compass className="w-4 h-4 text-gold" />
          Open in Companion
        </Link>
      </main>
    </div>
  );
}
