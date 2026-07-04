"use client";
import { X, Wallet, Users, MapPin, Calendar } from 'lucide-react';
import type { SavedPreferences } from '../../lib/preferenceStore';

interface PreferenceBadgeProps {
  prefs: SavedPreferences;
  onClear: () => void;
}

const BUDGET_LABELS: Record<string, string> = {
  budget: 'Budget',
  mid: 'Mid-Range',
  premium: 'Premium',
  luxury: 'Luxury',
};

export default function PreferenceBadge({ prefs, onClear }: PreferenceBadgeProps) {
  const chips: { icon: React.ReactNode; label: string }[] = [];

  if (prefs.budgetTier) {
    chips.push({
      icon: <Wallet className="w-3 h-3" />,
      label: BUDGET_LABELS[prefs.budgetTier] || prefs.budgetTier,
    });
  }
  if (prefs.travelerType) {
    chips.push({
      icon: <Users className="w-3 h-3" />,
      label: prefs.travelerType.charAt(0).toUpperCase() + prefs.travelerType.slice(1),
    });
  }
  if (prefs.destination && prefs.destination !== 'Goa') {
    chips.push({
      icon: <MapPin className="w-3 h-3" />,
      label: prefs.destination,
    });
  }
  if (prefs.duration) {
    chips.push({
      icon: <Calendar className="w-3 h-3" />,
      label: `${prefs.duration} days`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-micro text-muted/40 font-mono font-bold uppercase tracking-wider">
        Travebie remembers
      </span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/8 border border-gold/15 text-micro text-gold/70 font-medium"
        >
          {chip.icon}
          {chip.label}
        </span>
      ))}
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-micro text-muted/30 hover:text-muted/60 hover:bg-border/20 transition-colors cursor-pointer"
        aria-label="Clear remembered preferences"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
