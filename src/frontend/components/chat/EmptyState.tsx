"use client";
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import PromptBox from './PromptBox';
import SuggestedPrompts from './SuggestedPrompts';

interface EmptyStateProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

const stagger = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function EmptyState({ onSubmit, disabled }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] px-6 pt-[max(12px,env(safe-area-inset-top,0px))] pb-[max(12px,env(safe-area-inset-bottom))]">
      <motion.div
        className="w-full max-w-[640px] mx-auto text-center space-y-8"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div className="flex items-center justify-center gap-2 mb-2" variants={fadeUp}>
          <Compass className="w-6 h-6 text-gold animate-spin-slow" />
          <span className="font-logo text-xl text-night/40 lowercase">travebie</span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-6xl text-night font-light lowercase leading-[0.9] tracking-tight text-balance"
          variants={fadeUp}
        >
          what adventure are you planning?
        </motion.h1>

        <motion.p
          className="text-body text-muted/70 font-light max-w-md mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Describe your dream journey and Travebie will craft a personalized travel companion for you.
        </motion.p>

        <motion.div className="pt-2" variants={fadeUp}>
          <PromptBox onSubmit={onSubmit} disabled={disabled} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <SuggestedPrompts onSelect={onSubmit} disabled={disabled} />
        </motion.div>
      </motion.div>
    </div>
  );
}
