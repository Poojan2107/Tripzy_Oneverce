"use client";
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import type { ParsedSectionType } from '../../types';
import { parseAiResponse } from '../../lib/parseAiResponse';
import { findLocation } from '../../lib/placeData';

const ACTIVITY_PATTERNS: { test: RegExp; chips: string[] }[] = [
  { test: /beach|coast|sea|ocean/i, chips: ['Hidden beaches', 'Water sports'] },
  { test: /trek|hike|trail|mountain|climb/i, chips: ['Trek difficulty', 'Best trails'] },
  { test: /temple|shrine|religious|pilgrim/i, chips: ['Temple timings', 'Local guides'] },
  { test: /food|cuisine|restaurant|dining|eat|street food/i, chips: ['Street food tour', 'Cooking classes'] },
  { test: /nightlife|club|party|bar|pub/i, chips: ['Nightlife spots', 'Best clubs'] },
  { test: /shopping|market|bazaar|handicraft/i, chips: ['Best markets', 'Local souvenirs'] },
  { test: /heritage|history|fort|palace|culture|museum/i, chips: ['Heritage walk', 'Cultural experiences'] },
  { test: /adventure|rafting|paragliding|scuba|kayak/i, chips: ['Adventure activities', 'Safety tips'] },
  { test: /wildlife|safari|sanctuary|national.?park|bird/i, chips: ['Wildlife safari', 'Nature spots'] },
  { test: /spa|ayurveda|wellness|yoga|meditation/i, chips: ['Best spas', 'Wellness retreats'] },
  { test: /photography|photo|instagram|camera/i, chips: ['Photo spots', 'Golden hour tips'] },
  { test: /shopping|souvenir|handicraft|market|bazaar/i, chips: ['Shopping guide', 'Best souvenirs'] },
];

const GENERIC_CHIPS = [
  "Plan a different destination",
  "Tell me more about local culture",
];

function extractDestination(text: string): string | null {
  const loc = findLocation(text);
  if (loc) return loc.name;
  const match = text.match(/\b(?:in|to|for|around|visiting)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/);
  if (match) {
    const c = match[1];
    if (!['This', 'The', 'What', 'Your', 'Each', 'Day', 'Ideal', 'Best', 'With', 'More', 'Explore'].includes(c)) {
      return c;
    }
  }
  return null;
}

function hasBudgetMention(text: string): 'cheap' | 'luxury' | null {
  const lower = text.toLowerCase();
  if (/budget|cheap|affordable|budget.?friendly|cost.?effective/i.test(lower)) return 'cheap';
  if (/luxury|premium|five.?star|resort|high.?end/i.test(lower)) return 'luxury';
  return null;
}

function generateContextualChips(content: string, sectionTypes: ParsedSectionType[]): string[] {
  const chips: string[] = [];
  const seen = new Set<string>();
  const lower = content.toLowerCase();
  const destination = extractDestination(content);
  const budget = hasBudgetMention(content);

  const addChip = (chip: string) => {
    if (!seen.has(chip) && chips.length < 4) {
      seen.add(chip);
      chips.push(chip);
    }
  };

  // Activity-based chips
  for (const { test, chips: activityChips } of ACTIVITY_PATTERNS) {
    if (test.test(lower)) {
      activityChips.forEach(addChip);
    }
  }

  // Budget chip
  if (budget === 'cheap') addChip('Make it cheaper');
  if (budget === 'luxury' && chips.length < 4) addChip('Luxury version');

  // Destination-specific chip
  if (destination && chips.length < 4) {
    addChip(`Best time to visit ${destination}`);
  }
  if (destination && chips.length < 4) {
    addChip(`Hidden gems in ${destination}`);
  }

  // Fallback: section-based chips if not enough contextual chips
  if (chips.length < 2) {
    const sectionFallbacks: Partial<Record<ParsedSectionType, string[]>> = {
      timeline: ['More activities', 'Relaxed pace'],
      hotels: ['Cheaper hotels', 'Luxury stays'],
      food: ['Vegetarian options', 'Cooking classes'],
      budget: ['Optimize budget', 'Break down per person'],
      transport: ['How to get there', 'Local transport'],
      packing: ['Packing list', 'Seasonal gear'],
      weather: ['Best month', 'Avoid crowds'],
      tips: ['Safety tips', 'Photo spots'],
      experiences: ['Hidden gems', 'Local guides'],
    };
    for (const type of sectionTypes) {
      const fallbacks = sectionFallbacks[type];
      if (fallbacks) fallbacks.forEach(addChip);
    }
  }

  return chips;
}

interface FollowUpSuggestionsProps {
  content: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function FollowUpSuggestions({ content, onSubmit, disabled }: FollowUpSuggestionsProps) {
  const sections = useMemo(() => parseAiResponse(content), [content]);
  const sectionTypes = useMemo(() => sections.map((s) => s.type), [sections]);
  const prompts = useMemo(() => {
    const contextual = generateContextualChips(content, sectionTypes);
    return [...contextual, ...GENERIC_CHIPS];
  }, [content, sectionTypes]);

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
