"use client";
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Heart, Star, BookOpen, Compass } from 'lucide-react';
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
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}

export default function FeaturedChapters({ tours, wishlistIds, loadingDestinations, onSelectTour, onToggleWishlist }: FeaturedChaptersProps) {
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

  const chapterNumbers = ['01', '02', '03', '04'];

  return (
    <section className="py-20 md:py-28 bg-sand">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-16 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">regional profiles</span>
            <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em]">
              featured <em className="italic font-light text-gold">chapters</em> of the sub-continent
            </h2>
            <p className="mt-4 text-sm text-muted/80 font-light max-w-lg font-sans">Four distinct worlds. One subcontinent. Each chapter reveals a different India.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
            if (!tour) return (
              <div key={idx} className="flex flex-col space-y-4 text-left animate-pulse w-full">
                <div className="relative aspect-[4/3] rounded-3xl bg-cream/70" />
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
                  <div onClick={() => onSelectTour(tour)} className={`group cursor-pointer text-left ${!isEven ? 'md:mt-16' : ''}`}>
                    {/* Image container with editorial overlay */}
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card bg-cream mb-0">
                      <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />

                      {/* Dark gradient at bottom for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }} />

                      {/* Chapter number decorative badge */}
                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <BookOpen className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[9px] font-mono text-white/70 tracking-[0.2em] uppercase">Chapter {chapterNumbers[idx]}</span>
                      </div>

                      {/* Wishlist button */}
                      <motion.button
                        onClick={e => { e.stopPropagation(); onToggleWishlist(tour.id); }}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center shadow-sm cursor-pointer border border-white/20 hover:bg-white/30 transition-all"
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlistIds.includes(tour.id) ? 'fill-rose-400 text-rose-400' : 'text-white/80'}`} />
                      </motion.button>

                      {/* Title overlaid on image at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 pb-5">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-white/60 uppercase tracking-widest mb-1.5">
                          <span className="w-4 h-px bg-gold/60" />
                          <span>{tour.location}</span>
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl text-white font-light lowercase leading-tight">{tour.title}</h3>
                      </div>

                      {/* Hover content slide-up */}
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-6 pb-5 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                      </motion.div>
                    </div>

                    {/* Metadata row below image */}
                    <div className="px-1 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted" />
                          {tour.duration}
                        </span>
                        <span className="text-border/60">|</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-gold text-gold" />
                          <span className="font-semibold text-night">{parseFloat(tour.rating.toFixed(1))}</span>
                        </span>
                      </div>
                      <motion.span className="text-[10px] font-bold uppercase tracking-wider text-coral flex items-center gap-1.5 group-hover:gap-2.5 transition-all" whileHover={{ x: 3 }}>
                        Explore Chapter <ArrowRight className="w-3 h-3 text-gold" />
                      </motion.span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA link */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/"
            onClick={(e) => { e.preventDefault(); }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-night/20 text-night/80 hover:bg-night hover:text-white text-[10px] font-bold uppercase tracking-[0.18em] transition-all cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Compass className="w-4 h-4" /> View All Chapters
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
