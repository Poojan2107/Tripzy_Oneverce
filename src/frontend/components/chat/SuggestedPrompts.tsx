"use client";
import { motion } from 'framer-motion';
import { Sparkles, Mountain, Heart, Users, Map, Sun, Compass } from 'lucide-react';

const PROMPTS = [
  { icon: Sparkles, label: 'Weekend Escape', text: 'Plan a quick weekend getaway from Delhi' },
  { icon: Heart, label: 'Honeymoon', text: 'Romantic honeymoon trip for a couple' },
  { icon: Mountain, label: 'Solo Backpacking', text: 'Solo backpacking trip through Himachal' },
  { icon: Users, label: 'Family Trip', text: 'Family-friendly vacation with kids' },
  { icon: Map, label: 'Road Trip', text: 'Epic road trip across Rajasthan' },
  { icon: Sun, label: 'Spiritual', text: 'Spiritual journey through Varanasi and Rishikesh' },
  { icon: Compass, label: 'Adventure', text: 'Adventure trip with trekking and camping' },
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-surface/80 text-muted hover:text-night hover:border-gold/40 hover:bg-gold/5 text-meta font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon className="w-3.5 h-3.5 shrink-0" />
          {label}
        </motion.button>
      ))}
    </div>
  );
}
