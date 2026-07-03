"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, ChevronDown, Crown, Wallet, Tent } from 'lucide-react';

interface HotelEntry {
  name: string;
  price?: string;
  description?: string;
  tier: 'luxury' | 'mid' | 'budget' | null;
}

const TIERS = [
  { key: 'luxury', label: 'Luxury', icon: Crown, color: 'text-gold', bg: 'bg-gold/8', border: 'border-gold/20' },
  { key: 'mid', label: 'Mid-Range', icon: Wallet, color: 'text-teal', bg: 'bg-teal/8', border: 'border-teal/20' },
  { key: 'budget', label: 'Budget', icon: Tent, color: 'text-coral', bg: 'bg-coral/8', border: 'border-coral/20' },
];

function parseHotels(text: string): HotelEntry[] {
  const lines = text.split('\n').filter(Boolean);
  const hotels: HotelEntry[] = [];
  let currentTier: 'luxury' | 'mid' | 'budget' | null = null;
  let current: HotelEntry | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const tierMatch = trimmed.match(/^\*\*(luxury|mid.range|budget)\*\*/i) || trimmed.match(/^(luxury|mid.range|budget)/i);
    if (tierMatch) {
      if (current && current.name) hotels.push(current);
      current = null;
      const raw = tierMatch[1].toLowerCase();
      if (raw.startsWith('lux')) currentTier = 'luxury';
      else if (raw.startsWith('mid')) currentTier = 'mid';
      else if (raw.startsWith('bud')) currentTier = 'budget';
      continue;
    }

    const nameMatch = trimmed.match(/^(?:\*\*)?([A-Z][A-Za-z\s'&.]+?)(?:\*\*)?\s*(?:[–-]|:|\s+–\s+)/);
    const priceMatch = trimmed.match(/[₹$€]\s*[\d,]+(?:\s*[–-]\s*[₹$€]\s*[\d,]+)?/);
    const descLine = trimmed.replace(/^[-–*•]\s*/, '').trim();

    if (nameMatch || (descLine.length > 3 && descLine.length < 60 && !trimmed.startsWith('-'))) {
      if (current && current.name) hotels.push(current);
      current = {
        name: nameMatch ? nameMatch[1].trim() : descLine,
        price: priceMatch?.[0],
        description: '',
        tier: currentTier,
      };
    } else if (current && descLine) {
      current.description = current.description ? current.description + ' ' + descLine : descLine;
    }
  }
  if (current && current.name) hotels.push(current);
  return hotels.length > 0 ? hotels : [{ name: text.slice(0, 80) + '…', tier: null }];
}

function formatPrice(p?: string): string {
  if (!p) return '';
  const num = p.replace(/[^0-9]/g, '');
  if (!num) return p;
  return `₹${parseInt(num).toLocaleString('en-IN')}`;
}

export default function HotelGrid({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const hotels = parseHotels(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Bed className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Hotels & Accommodation</h3>
          {hotels.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{hotels.length}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {hotels.map((hotel, idx) => {
                const tierConfig = TIERS.find((t) => t.key === hotel.tier);
                return (
                  <div key={idx}>
                    {tierConfig && idx === hotels.findIndex((h) => h.tier === hotel.tier) && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${tierConfig.bg} border ${tierConfig.border} mb-2`}>
                        <tierConfig.icon className={`w-3 h-3 ${tierConfig.color}`} />
                        <span className={`text-micro font-mono font-bold uppercase tracking-wider ${tierConfig.color}`}>
                          {tierConfig.label}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-night font-semibold">{hotel.name}</p>
                        {hotel.description && (
                          <p className="text-small text-muted/70 mt-0.5 leading-relaxed line-clamp-2">{hotel.description}</p>
                        )}
                      </div>
                      {hotel.price && (
                        <span className="text-caption text-teal font-bold whitespace-nowrap shrink-0">{formatPrice(hotel.price)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {hotels.length === 0 && (
                <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
