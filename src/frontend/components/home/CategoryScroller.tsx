"use client";
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from './data';
import ScrollReveal from '../ui/ScrollReveal';

interface CategoryScrollerProps {
  onQuickCategoryClick: (category: string) => void;
}

export default function CategoryScroller({ onQuickCategoryClick }: CategoryScrollerProps) {
  return (
    <section className="py-12 md:py-16 bg-sand">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-8 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">discover by archetype</span>
            <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
              india through <em className="italic font-light text-gold">journeys</em>
            </h2>
          </div>
        </ScrollReveal>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-snap-x -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16 max-w-[100vw]">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => onQuickCategoryClick(cat.id)} className="snap-card flex-shrink-0 w-64 h-36 relative rounded-2xl overflow-hidden cursor-pointer group text-left border border-warm-gray/40">
              <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">{cat.mood}</span>
                <span className="font-display text-xl text-white font-light lowercase">{cat.label}</span>
              </div>
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
