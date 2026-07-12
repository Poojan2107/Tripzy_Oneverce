"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Star, BookOpen, Compass } from 'lucide-react';
import { Tour } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';

interface FeaturedChaptersProps {
  tours: Tour[];
  wishlistIds: string[];
  loadingDestinations: boolean;
  onSelectTour: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
  onGoToPlanner?: () => void;
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

export default function FeaturedChapters({ tours, wishlistIds, loadingDestinations, onSelectTour, onToggleWishlist, onGoToPlanner }: FeaturedChaptersProps) {
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

  const chapterNumbers = ['01', '02', '03', '04'];

  return (
    <section className="py-16 md:py-20 bg-white border-t border-border/15 premium-grid">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-14 text-left">
            <span className="text-meta font-mono text-coral block mb-2">regional profiles</span>
            <h2 className="font-display text-heading text-night lowercase font-light tracking-[-0.04em]">
              featured <em className="italic font-light text-gold">chapters</em> of the subcontinent
            </h2>
            <p className="mt-3 text-body text-muted/80 font-light max-w-lg">Four distinct worlds. One subcontinent. Each chapter reveals a different India.</p>
          </div>
        </ScrollReveal>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
            if (!tour) return (
              <div key={idx} className="flex flex-col space-y-4 text-left animate-pulse w-full">
                <div className="relative aspect-[4/3] rounded-xl bg-secondary-surface/70" />
                <div className="px-1 space-y-2">
                  <div className="flex justify-between"><div className="w-1/4 h-3 bg-secondary-surface rounded" /><div className="w-1/5 h-3 bg-secondary-surface rounded" /></div>
                  <div className="w-2/3 h-6 bg-secondary-surface rounded" /><div className="w-full h-4 bg-secondary-surface rounded" />
                </div>
              </div>
            );
 
            const accentColor = tour.accents?.primary || '#FDB62F';
 
            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 80, damping: 20 }}
                className="h-full"
              >
                <TiltCard className="h-full">
                  <div onClick={() => onSelectTour(tour)} className="group cursor-pointer text-left flex flex-col justify-between h-full bg-surface border border-border/40 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300">
                    {/* Image container with editorial overlay */}
                    <div className="relative h-[280px] sm:h-[320px] md:h-[340px] rounded-xl overflow-hidden bg-secondary-surface mb-4 w-full shrink-0">
                      <Image src={tour.bannerImage} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
 
                      {/* Dark gradient overlay at bottom for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${accentColor}30, transparent)` }} />
 
                      {/* Chapter number decorative badge */}
                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <div className="w-8.5 h-8.5 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-meta font-mono text-white/70">Chapter {chapterNumbers[idx]}</span>
                      </div>
 
                      {/* Wishlist button */}
                      <motion.button
                        onClick={e => { e.stopPropagation(); onToggleWishlist(tour.id); }}
                        className="absolute top-5 right-5 btn-ghost w-8.5 h-8.5"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Heart className={`w-4 h-4 ${wishlistIds.includes(tour.id) ? 'fill-rose-400 text-rose-400' : 'text-white/80'}`} />
                      </motion.button>
 
                      {/* Title and metadata overlaid on image at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 pb-5">
                        <div className="flex items-center gap-2 text-meta font-mono text-white/60 mb-2">
                          <span className="w-4 h-px bg-gold/60" />
                          <span>{tour.location}</span>
                          <span className="text-white/20 mx-1">·</span>
                          <span className="text-gold/80">{tour.duration}</span>
                        </div>
                        <h3 className="font-display text-card text-white font-light lowercase leading-tight mb-1">{tour.title}</h3>
                        <p className="text-body text-white/50 font-light leading-relaxed max-w-md line-clamp-2">{tour.subtitle}</p>
                      </div>
                    </div>
 
                    {/* Rating and reviews, explore link removed */}
                    <div className="px-0.5 pt-2 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-meta text-muted/60">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span className="font-semibold text-night">{(tour.rating ?? 0).toFixed(1)}</span>
                        </span>
                        <span className="text-border/40">·</span>
                        <span>{tour.reviewsCount} reviews</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
 
        {/* Bottom CTA link */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => onGoToPlanner?.()}
            className="btn btn-outline border-night/20 text-night/80 hover:bg-night hover:text-white h-12 px-6 rounded-md text-caption flex items-center gap-2 mx-auto cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Compass className="w-4 h-4" /> Generate Trip
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
