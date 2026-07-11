"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.18 } },
};

const TRAVEL_THOUGHTS = [
  "Looking for places locals actually love…",
  "Finding peaceful stays…",
  "Planning around the best season…",
  "Searching beyond the obvious…",
  "Quiet corners worth the detour…",
  "Moments that don't make the guidebooks…",
  "The kind of mornings you'll remember…",
  "Paths less walked…",
];

export default function TypingIndicator() {
  const [thought, setThought] = useState(TRAVEL_THOUGHTS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThought((prev) => {
        const idx = TRAVEL_THOUGHTS.indexOf(prev);
        return TRAVEL_THOUGHTS[(idx + 1) % TRAVEL_THOUGHTS.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="px-6 py-3"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="AI is typing"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold/40"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <span className="text-micro text-muted/40 font-medium tracking-wide italic">{thought}</span>
      </div>
    </motion.div>
  );
}
