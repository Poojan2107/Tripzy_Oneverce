"use client";
import { motion } from 'framer-motion';
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

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function EmptyState({ onSubmit, disabled, savedPrefs, onClearPrefs }: EmptyStateProps) {
  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        className="w-full max-w-[640px] mx-auto text-center space-y-8"
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl text-night font-light lowercase leading-[1.0] tracking-tight text-balance"
          variants={fadeUp}
        >
          where would you like to go next?
        </motion.h1>

        <motion.p
          className="text-body text-muted/60 font-light max-w-md mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Let's plan something unforgettable.
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
