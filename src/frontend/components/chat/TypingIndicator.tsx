"use client";
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

export default function TypingIndicator() {
  return (
    <motion.div
      className="px-6 py-2"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="AI is typing"
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
          <span className="text-micro text-muted/30 font-mono uppercase tracking-widest">Thinking...</span>
        </div>
      </div>
    </motion.div>
  );
}
