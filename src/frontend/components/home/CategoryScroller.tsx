"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Mountain, Coffee, TreePine, Compass } from 'lucide-react';
import { CATEGORIES } from './data';
import ScrollReveal from '../ui/ScrollReveal';

interface CategoryScrollerProps {
  onQuickCategoryClick: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Spiritual: Sparkles, Adventure: Mountain, Luxury: Coffee,
  Food: Coffee, Nature: TreePine, Hidden: Compass,
};

export default function CategoryScroller({ onQuickCategoryClick }: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-8 text-left">
            <span className="font-mono text-micro uppercase tracking-[0.3em] text-coral block mb-2 font-bold">discover by archetype</span>
            <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
              india through <em className="italic font-light text-gold">journeys</em>
            </h2>
          </div>
        </ScrollReveal>

        {/* Scroll container with edge fades */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-sand to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-sand to-transparent z-10 pointer-events-none" />

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-snap-x -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16 max-w-[100vw]">
            {CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.id] || Compass;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onQuickCategoryClick(cat.id)}
                  className="snap-card flex-shrink-0 w-72 h-44 relative rounded-3xl overflow-hidden cursor-pointer group text-left"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all">
                    <Icon className="w-4 h-4 text-white/80 group-hover:text-gold transition-colors" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-micro font-mono uppercase tracking-[0.25em] text-gold block mb-1">{cat.mood}</span>
                    <span className="font-display text-xl text-white font-light lowercase">{cat.label}</span>
                  </div>

                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
