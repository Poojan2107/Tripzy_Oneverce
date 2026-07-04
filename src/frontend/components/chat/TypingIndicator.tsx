"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.2 } },
};

const dotVariants = {
  animate: (i: number) => ({
    y: [0, -5, 0],
    transition: { repeat: Infinity, duration: 0.55, delay: i * 0.15, ease: 'easeInOut' as const },
  }),
};

const TRAVEL_THOUGHTS = [
  "Finding hidden places...",
  "Checking local experiences...",
  "Building your itinerary...",
  "Looking for authentic food...",
  "Comparing hotel options...",
  "Optimizing your budget...",
  "Planning the best route...",
  "Preparing travel tips...",
];

export default function TypingIndicator() {
  const [thought, setThought] = useState(TRAVEL_THOUGHTS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThought((prev) => {
        const idx = TRAVEL_THOUGHTS.indexOf(prev);
        return TRAVEL_THOUGHTS[(idx + 1) % TRAVEL_THOUGHTS.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="px-6 py-2"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="AI is typing"
      aria-live="polite"
    >
      <div className="max-w-full">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-micro font-bold uppercase tracking-widest text-muted/40">Travebie AI</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-background border border-border/20">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-gold/50"
                variants={dotVariants}
                animate="animate"
                custom={i}
              />
            ))}
          </div>
          <span className="text-micro text-muted/50 font-medium tracking-wide animate-pulse">{thought}</span>
        </div>
      </div>
    </motion.div>
  );
}
