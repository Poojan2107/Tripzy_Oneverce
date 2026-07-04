"use client";
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import PromptBox from './PromptBox';
import SuggestedPrompts from './SuggestedPrompts';
import PreferenceBadge from './PreferenceBadge';
import type { SavedPreferences } from '../../lib/preferenceStore';

interface EmptyStateProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  savedPrefs?: SavedPreferences;
  onClearPrefs?: () => void;
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

export default function EmptyState({ onSubmit, disabled, savedPrefs, onClearPrefs }: EmptyStateProps) {
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

        <motion.div className="relative" variants={fadeUp}>
          <svg
            viewBox="0 0 64 64"
            className="w-12 h-12 mx-auto mb-4 text-muted/15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="32" cy="32" r="28" />
            <circle cx="32" cy="32" r="10" />
            <path d="M32 4v8M32 52v8M4 32h8M52 32h8" />
            <path d="M10.75 10.75l5.66 5.66M47.59 47.59l5.66 5.66M10.75 53.25l5.66-5.66M47.59 16.41l5.66-5.66" strokeWidth="1" opacity="0.5" />
          </svg>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-6xl text-night font-light lowercase leading-[0.9] tracking-tight text-balance"
          variants={fadeUp}
        >
          where would you like to go next?
        </motion.h1>

        <motion.p
          className="text-body text-muted/60 font-light max-w-md mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Tell Travebie your dream trip and get a beautifully crafted itinerary.
        </motion.p>

        {savedPrefs && onClearPrefs && (
          <motion.div className="flex justify-center" variants={fadeUp}>
            <PreferenceBadge prefs={savedPrefs} onClear={onClearPrefs} />
          </motion.div>
        )}

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
