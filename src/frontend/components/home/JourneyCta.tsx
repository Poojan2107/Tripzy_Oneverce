"use client";
import { Sparkles, Compass } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

interface JourneyCtaProps {
  onGoToPlanner: () => void;
  onGoToExplore: () => void;
}

export default function JourneyCta({ onGoToPlanner, onGoToExplore }: JourneyCtaProps) {
  return (
    <section className="py-16 md:py-24 bg-cream/30 border-t border-warm-gray/30">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 text-center">
        <div className="relative border border-gold/30 rounded-[32px] p-8 md:p-14 bg-white/60 backdrop-blur-sm overflow-hidden shadow-soft">
          <div className="absolute inset-0 bg-radial-gradient(circle, rgba(253,182,47,0.05) 0%, transparent 100%) pointer-events-none" />
          <ScrollReveal>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-coral block mb-4 font-bold">the voyage awaits</span>
            <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em] leading-[1.05] mb-6">
              script your own <br />
              <span className="italic font-light text-gold font-normal">indian odyssey</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-light max-w-xl mx-auto mb-8 font-sans">
              Our journey builder crafts customized itineraries rooted in local secrets, signature food experiences, and real coordinates — in under a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={onGoToPlanner} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-ocean transition-all duration-300 cursor-pointer shadow-md hover:scale-102 animate-bounce-slow">
                <Sparkles className="w-4 h-4 text-gold" /> Plan Your Journey
              </button>
              <button onClick={onGoToExplore} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-night text-night text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-night hover:text-white transition-all duration-300 cursor-pointer">
                <Compass className="w-4 h-4" /> Browse Atlas
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
