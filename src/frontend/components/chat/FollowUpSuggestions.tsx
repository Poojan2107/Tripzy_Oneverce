"use client";
import { Sparkles } from 'lucide-react';
import type { ParsedSectionType } from '../../types';
import { parseAiResponse } from '../../lib/parseAiResponse';

const FOLLOW_UP_MAP: Partial<Record<ParsedSectionType, string[]>> = {
  overview: [
    "What's the best time to visit?",
    "How many days do you recommend?",
  ],
  timeline: [
    "Can you add more activities?",
    "What if I have less time?",
    "Suggest a more relaxed pace",
  ],
  hotels: [
    "Are there cheaper options?",
    "Show me luxury stays",
    "What area should I stay in?",
  ],
  budget: [
    "Can you optimize the budget?",
    "What if I splurge on hotels?",
    "Break it down per person",
  ],
  food: [
    "Best street food spots?",
    "Vegetarian-friendly options?",
    "Any cooking classes?",
  ],
  transport: [
    "How to get there from Delhi?",
    "Best way to get around?",
    "Is there a direct flight?",
  ],
  packing: [
    "What to pack for this season?",
  ],
  weather: [
    "Avoid monsoon season?",
    "Best month to visit?",
  ],
  tips: [
    "Safety tips for solo travelers?",
    "Best photography spots?",
    "Cultural etiquette to know?",
  ],
  experiences: [
    "Hidden gems off the beaten path?",
    "Best for solo travelers?",
    "Any local guides?",
  ],
};

function getFollowUps(sectionTypes: ParsedSectionType[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const type of sectionTypes) {
    const prompts = FOLLOW_UP_MAP[type] || [];
    for (const p of prompts) {
      if (!seen.has(p)) {
        seen.add(p);
        result.push(p);
      }
    }
  }

  return result.slice(0, 4);
}

const GENERIC_FOLLOW_UPS = [
  "Plan a different destination",
  "Tell me more about the local culture",
];

interface FollowUpSuggestionsProps {
  content: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function FollowUpSuggestions({ content, onSubmit, disabled }: FollowUpSuggestionsProps) {
  const sections = parseAiResponse(content);
  const sectionTypes = sections.map((s) => s.type);
  const prompts = [...getFollowUps(sectionTypes), ...GENERIC_FOLLOW_UPS];

  if (prompts.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-border/20">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles className="w-3 h-3 text-muted/40" />
        <span className="text-micro text-muted/40 font-mono uppercase tracking-widest">Continue exploring</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSubmit(prompt)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/50 bg-background/80 text-muted hover:text-night hover:border-gold/30 hover:bg-gold/5 text-micro font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
