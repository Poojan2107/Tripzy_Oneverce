"use client";
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Heart, Star } from 'lucide-react';
import { Tour } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';

interface FeaturedChaptersProps {
  tours: Tour[];
  wishlistIds: string[];
  loadingDestinations: boolean;
  onSelectTour: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="relative">
        {children}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(253,182,47,0.06), transparent)' }}
          whileHover={{ opacity: 1 }}
        />
      </div>
    </motion.div>
  );
}

export default function FeaturedChapters({ tours, wishlistIds, loadingDestinations, onSelectTour, onToggleWishlist }: FeaturedChaptersProps) {
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

  return (
    <section className="py-14 md:py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">regional profiles</span>
            <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em]">
              featured <em className="italic font-light text-gold">chapters</em> of the sub-continent
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
            if (!tour) return (
              <div key={idx} className="flex flex-col space-y-4 text-left animate-pulse w-full">
                <div className="relative aspect-[16/9] rounded-3xl bg-cream/70" />
                <div className="px-1 space-y-2">
                  <div className="flex justify-between"><div className="w-1/4 h-3 bg-cream rounded" /><div className="w-1/5 h-3 bg-cream rounded" /></div>
                  <div className="w-2/3 h-6 bg-cream rounded" /><div className="w-full h-4 bg-cream rounded" />
                </div>
              </div>
            );

            const isEven = idx % 2 === 0;
            const accentColor = tour.accents?.primary || '#FDB62F';

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 80, damping: 20 }}
              >
                <TiltCard>
                  <div onClick={() => onSelectTour(tour)} className={`flex flex-col cursor-pointer group text-left ${!isEven ? 'md:mt-12' : ''}`}>
                    <div className="relative aspect-destination rounded-3xl overflow-hidden shadow-card border border-border bg-cream mb-4">
                      <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" style={{ backgroundColor: accentColor }} />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                          onClick={e => { e.stopPropagation(); onToggleWishlist(tour.id); }}
                          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer border border-border"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlistIds.includes(tour.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="px-1 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-muted uppercase tracking-widest">
                        <span>{tour.location}</span>
                        <span>{tour.chapterName || 'Featured Chapter'}</span>
                      </div>
                      <h3 className="font-display text-2xl text-night font-medium lowercase leading-tight group-hover:text-coral transition-colors">{tour.title}</h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-2 text-[10px] text-muted">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-muted" />{tour.duration}</span>
                          <span className="text-border/60">•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                            <span className="font-bold text-night">{parseFloat(tour.rating.toFixed(1))}</span>
                          </span>
                        </span>
                        <motion.span className="text-[10px] font-bold uppercase tracking-wider text-coral flex items-center gap-1" whileHover={{ x: 3 }}>
                          Explore <ArrowRight className="w-3 h-3 text-gold" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
