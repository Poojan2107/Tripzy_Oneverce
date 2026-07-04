"use client";
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Map, Sun, Compass, Mountain } from 'lucide-react';

const PROMPTS = [
  { icon: Sparkles, label: 'Plan a weekend escape', text: 'Plan a quick weekend getaway from Delhi' },
  { icon: Heart, label: 'Plan a romantic trip', text: 'Romantic honeymoon trip for a couple' },
  { icon: Mountain, label: 'Plan a solo adventure', text: 'Solo backpacking trip through Himachal' },
  { icon: Users, label: 'Plan a family vacation', text: 'Family-friendly vacation with kids' },
  { icon: Map, label: 'Plan a road trip', text: 'Epic road trip across Rajasthan' },
  { icon: Sun, label: 'Plan a spiritual journey', text: 'Spiritual journey through Varanasi and Rishikesh' },
  { icon: Compass, label: 'Plan an adventure', text: 'Adventure trip with trekking and camping' },
];

interface SuggestedPromptsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

const chipVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.3 + i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 pt-2">
      {PROMPTS.map(({ icon: Icon, label, text }, i) => (
        <motion.button
          key={label}
          custom={i}
          variants={chipVariants}
          initial="initial"
          animate="animate"
          onClick={() => onSelect(text)}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/60 bg-surface/80 text-muted/80 hover:text-night hover:border-gold/40 hover:bg-gold/5 text-caption font-semibold tracking-normal transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <Icon className="w-4 h-4 shrink-0 opacity-60" />
          {label}
        </motion.button>
      ))}
    </div>
  );
}
