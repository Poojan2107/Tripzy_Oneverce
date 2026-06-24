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
    <div className="max-lg:static lg:sticky lg:top-24 space-y-4">
      <motion.div className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-bold text-sm text-night">{parseFloat(tour.rating.toFixed(1))}</span>
            <span className="text-xs text-muted font-light">({tour.reviewsCount} reviews)</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sand border border-warm-gray text-night">{tour.difficulty}</span>
        </div>
        <div className="py-4 border-y border-warm-gray/40 mb-5">
          <span className="text-3xl font-display font-bold text-night">{formatINR(tour.price)}</span>
          <span className="text-xs text-muted font-light ml-1">/ person daily</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <motion.button onClick={onPlanClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold hover:bg-gold/90 text-[10px] font-bold uppercase tracking-[0.15em] text-night hover:shadow-[0_4px_15px_rgba(253,182,47,0.3)] transition-all cursor-pointer border-none min-h-[46px]"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Sparkles className="w-4 h-4 text-[#0B1720]" />
            <span>Start AI Planning</span>
          </motion.button>
        </div>
      </motion.div>

      {cultural && (
        <motion.div className="p-5 rounded-3xl bg-white border border-warm-gray shadow-card"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <h3 className="font-bold text-xs text-night uppercase tracking-wider mb-4 border-b border-warm-gray/40 pb-2">Destination Snapshot</h3>
          <div className="space-y-3">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-1">Best Time</span>
              <span className="text-xs font-bold text-night flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-coral" /> {tour.bestSeason || 'Oct – Mar'}</span>
            </div>
            <div className="border-t border-warm-gray/30 pt-3">
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Must Try</span>
              <p className="text-[10px] text-night/70 font-medium leading-relaxed">{cultural.mustDo[0]}</p>
            </div>
            <div className="border-t border-warm-gray/30 pt-3">
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Local Secret</span>
              <p className="text-[10px] text-night/70 font-medium leading-relaxed">{tour.localSecret}</p>
            </div>
          </div>
        </motion.div>
      )}

      {tour.reviews.length > 0 && (
        <motion.div className="p-5 rounded-3xl bg-white border border-warm-gray shadow-card"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <h3 className="font-bold text-xs text-night uppercase tracking-wider mb-4 border-b border-warm-gray/40 pb-2">Traveler Notes</h3>
          <div className="space-y-4">
            {tour.reviews.slice(0, 2).map((r) => (
              <div key={r.id} className="space-y-1.5 pb-3 border-b border-warm-gray/20 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <img src={r.avatar} alt={r.author} className="w-7 h-7 rounded-full object-cover border border-warm-gray" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                  <div>
                    <p className="text-xs font-bold text-night">{r.author}</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                      <span className="text-[9px] font-bold text-muted">{r.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-muted font-light leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
