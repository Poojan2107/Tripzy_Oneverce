"use client";
import { motion } from 'framer-motion';
import { Star, Calendar, Sparkles } from 'lucide-react';
import { Tour } from '../../types';
import { formatINR } from '../../utils/currency';
import { CulturalContext } from './data';

interface SidebarProps {
  tour: Tour;
  cultural?: CulturalContext;
  onPlanClick: () => void;
}

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };

export default function Sidebar({ tour, cultural, onPlanClick }: SidebarProps) {
  return (
    <div className="max-lg:static lg:sticky lg:top-24 space-y-4 text-left">
      <motion.div className="p-6 rounded-lg bg-white border border-border/70 shadow-sm"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-bold text-body text-night">{(tour.rating ?? 0).toFixed(1)}</span>
            <span className="text-meta text-muted">({tour.reviewsCount} reviews)</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-sm text-meta font-bold uppercase bg-background border border-border text-night">{tour.difficulty}</span>
        </div>
        <div className="py-4 border-y border-border/20 mb-5 hidden lg:block">
          <span className="text-heading font-display font-bold text-night">{formatINR(tour.price)}</span>
          <span className="text-meta text-muted ml-1">/ person daily</span>
        </div>
        <div className="flex flex-col gap-2.5 hidden lg:flex">
          <motion.button onClick={onPlanClick}
            className="btn btn-primary w-full h-11 px-5 rounded-md text-caption flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/15"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Sparkles className="w-4 h-4 text-night animate-pulse" />
            <span>Craft Journey</span>
          </motion.button>
        </div>
      </motion.div>
 
      {cultural && (
        <motion.div className="p-5 rounded-lg bg-white border border-border/70 shadow-sm"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <h3 className="font-bold text-caption text-night uppercase mb-4 border-b border-border/20 pb-2">Destination Snapshot</h3>
          <div className="space-y-3">
            <div>
              <span className="text-meta font-mono text-muted/50 block mb-1">Best Time</span>
              <span className="text-body font-bold text-night flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-coral" /> {tour.bestSeason || 'Oct – Mar'}</span>
            </div>
            <div className="border-t border-border/15 pt-3">
              <span className="text-meta font-mono text-muted/50 block mb-2">Must Try</span>
              <p className="text-meta text-night/75 leading-relaxed font-normal">{cultural.mustDo[0]}</p>
            </div>
            <div className="border-t border-border/15 pt-3">
              <span className="text-meta font-mono text-muted/50 block mb-2">Local Secret</span>
              <p className="text-meta text-night/75 leading-relaxed font-normal">{tour.localSecret}</p>
            </div>
          </div>
        </motion.div>
      )}
 
      {tour.reviews.length > 0 && (
        <motion.div className="p-5 rounded-lg bg-white border border-border/70 shadow-sm"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <h3 className="font-bold text-caption text-night uppercase mb-4 border-b border-border/20 pb-2">Traveler Notes</h3>
          <div className="space-y-4">
            {tour.reviews.slice(0, 2).map((r) => (
              <div key={r.id} className="space-y-1.5 pb-3 border-b border-border/15 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <img src={r.avatar} alt={r.author} className="w-7 h-7 rounded-full object-cover border border-border" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                  <div>
                    <p className="text-body font-bold text-night">{r.author}</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                      <span className="text-meta font-bold text-muted">{r.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-body text-muted/80 font-light leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
