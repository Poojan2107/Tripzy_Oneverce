"use client";
import { motion } from 'framer-motion';
import { Clock, User, Zap, Calendar, Star } from 'lucide-react';
import { Tour } from '../../types';

const statItems = [
  { key: 'duration', icon: Clock, color: 'text-gold', label: 'Duration', get: (t: Tour) => t.duration },
  { key: 'group', icon: User, color: 'text-ocean', label: 'Group', get: (t: Tour) => t.groupSize },
  { key: 'difficulty', icon: Zap, color: 'text-sage', label: 'Difficulty', get: (t: Tour) => t.difficulty },
  { key: 'bestTime', icon: Calendar, color: 'text-coral', label: 'Best Time', get: (t: Tour) => t.bestSeason || 'Oct – Mar' },
  { key: 'rating', icon: Star, color: 'fill-gold text-gold', label: 'Rating', get: (t: Tour) => `${parseFloat(t.rating.toFixed(1))} (${t.reviewsCount} reviews)` },
  { key: 'budget', icon: null, color: 'text-night', label: 'Budget Range', get: (t: Tour) => t.budgetRange || '', conditional: (t: Tour) => !!t.budgetRange },
];

const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };

export default function StatsBar({ tour }: { tour: Tour }) {
  return (
    <div className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="flex items-center gap-6 py-4 overflow-x-auto no-scrollbar"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }}>
          {statItems.filter(s => !s.conditional || s.conditional(tour)).map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.key} variants={fadeUp} className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 shrink-0">
                  {Icon ? <Icon className={`w-4 h-4 ${s.color}`} /> : <span className="text-lg" style={{ lineHeight: 1 }}>₹</span>}
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">{s.label}</p>
                    <p className="text-xs font-bold text-night">{s.get(tour)}</p>
                  </div>
                </div>
                {i < statItems.filter(x => !x.conditional || x.conditional(tour)).length - 1 && <div className="w-px h-8 bg-border ml-2" />}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
