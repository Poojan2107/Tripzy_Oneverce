"use client";
import Image from 'next/image';
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
    <section className="py-16 md:py-24 bg-background relative border-t border-border/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-8 text-left">
            <span className="text-meta font-mono text-coral block mb-2">discover by archetype</span>
            <h2 className="font-display text-heading text-night lowercase font-light tracking-[-0.03em]">
              india through <em className="italic font-light text-gold">journeys</em>
            </h2>
          </div>
        </ScrollReveal>
 
        {/* Scroll container with edge fades */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F4EE] to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F4EE] to-transparent z-10 pointer-events-none" />
 
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-snap-x -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16 max-w-[100vw]">
            {CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.id] || Compass;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onQuickCategoryClick(cat.id)}
                  className="snap-card flex-shrink-0 w-[min(18rem,75vw)] h-56 md:h-64 relative rounded-lg overflow-hidden cursor-pointer group text-left"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Image src={cat.image} alt={cat.label} fill className="object-cover group-hover:scale-105" sizes="(max-width: 768px) 75vw, 18rem" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-md bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all">
                    <Icon className="w-4.5 h-4.5 text-white/80 group-hover:text-gold transition-colors" />
                  </div>
 
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-meta font-mono text-gold block mb-1">{cat.mood}</span>
                    <span className="font-display text-card text-white font-light lowercase">{cat.label}</span>
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
