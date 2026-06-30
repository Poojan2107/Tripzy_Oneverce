"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Tour } from '../../types';
import ServiceIcon from './ServiceIcon';

interface ItineraryTabProps {
  tour: Tour;
  activeDay: number;
  onDayChange: (day: number) => void;
  accentColor: string;
}

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };

export default function ItineraryTab({ tour, activeDay, onDayChange, accentColor }: ItineraryTabProps) {
  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-section text-night font-bold mb-1">Daily Itinerary</h2>
        <p className="text-body text-muted/85 font-light">Each day is crafted around natural rhythms — sunrise rituals, midday exploration, and evening culture.</p>
      </motion.div>
 
      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {(tour.itinerary || []).map((day) => (
          <button key={day.day} onClick={() => onDayChange(day.day)} className={`px-4 py-2.5 btn-ghost text-meta font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer min-h-[38px] flex items-center ${activeDay === day.day ? 'bg-night text-white border-night' : 'bg-white text-muted border-border shadow-sm'}`}>
            Day {day.day}
          </button>
        ))}
      </motion.div>
 
      <AnimatePresence mode="wait">
        {(tour.itinerary || []).filter(d => d.day === activeDay).map((day) => (
          <motion.div key={day.day}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="p-6 rounded-lg bg-white border border-border/70 shadow-sm space-y-4">
            <div>
              <span className="text-meta font-mono text-coral block mb-1">Day {day.day}</span>
              <h3 className="font-display text-card text-night font-bold">{day.title}</h3>
              <p className="text-body text-muted/80 font-light mt-2 leading-relaxed">{day.description}</p>
            </div>
            {day.activities.length > 0 && (
              <div className="border-t border-border/15 pt-4 space-y-2">
                <span className="text-meta font-mono text-muted/50 block">Activities</span>
                <ul className="space-y-2">
                  {day.activities.map((a, i) => (
                    <li key={i} className="flex items-center gap-3 text-body text-muted/80 font-light">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
 
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-section text-night font-bold mb-4">What's Included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(tour.includedServices || []).map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-4 rounded-md bg-white border border-border/70 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-secondary-surface flex items-center justify-center"><ServiceIcon iconName={s.iconName} /></div>
              <span className="text-body text-night font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
