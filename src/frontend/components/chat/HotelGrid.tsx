"use client";
import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, ChevronDown, Crown, Wallet, Tent, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface HotelEntry {
  name: string;
  price?: string;
  priceNum: number | null;
  description?: string;
  tier: 'luxury' | 'mid' | 'budget' | null;
}

const TIERS = [
  { key: 'luxury', label: 'Luxury', icon: Crown, color: 'text-gold', bg: 'bg-gold/8', border: 'border-gold/20' },
  { key: 'mid', label: 'Mid-Range', icon: Wallet, color: 'text-teal', bg: 'bg-teal/8', border: 'border-teal/20' },
  { key: 'budget', label: 'Budget', icon: Tent, color: 'text-coral', bg: 'bg-coral/8', border: 'border-coral/20' },
];

type SortMode = 'tier' | 'price-asc' | 'price-desc';

function parsePriceNum(p?: string): number | null {
  if (!p) return null;
  const num = p.replace(/[^0-9]/g, '');
  return num ? parseInt(num, 10) : null;
}

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
        priceNum: parsePriceNum(priceMatch?.[0]),
        description: '',
        tier: currentTier,
      };
    } else if (current && descLine) {
      current.description = current.description ? current.description + ' ' + descLine : descLine;
    }
  }
  if (current && current.name) hotels.push(current);
  return hotels.length > 0 ? hotels : [{ name: text.slice(0, 80) + '…', priceNum: null, tier: null }];
}

const TIER_ORDER = { luxury: 0, mid: 1, budget: 2 };

function sortHotels(hotels: HotelEntry[], mode: SortMode): HotelEntry[] {
  const sorted = [...hotels];
  if (mode === 'tier') {
    sorted.sort((a, b) => {
      const ta = a.tier ? TIER_ORDER[a.tier] : 3;
      const tb = b.tier ? TIER_ORDER[b.tier] : 3;
      return ta - tb;
    });
  } else if (mode === 'price-asc') {
    sorted.sort((a, b) => (a.priceNum ?? Infinity) - (b.priceNum ?? Infinity));
  } else if (mode === 'price-desc') {
    sorted.sort((a, b) => (b.priceNum ?? 0) - (a.priceNum ?? 0));
  }
  return sorted;
}

function formatPrice(p?: string): string {
  if (!p) return '';
  const num = p.replace(/[^0-9]/g, '');
  if (!num) return p;
  return `₹${parseInt(num).toLocaleString('en-IN')}`;
}

const SORT_OPTIONS: { key: SortMode; label: string; icon: React.ReactNode }[] = [
  { key: 'tier', label: 'Tier', icon: <ArrowUpDown className="w-3 h-3" /> },
  { key: 'price-asc', label: 'Price ↑', icon: <ArrowUp className="w-3 h-3" /> },
  { key: 'price-desc', label: 'Price ↓', icon: <ArrowDown className="w-3 h-3" /> },
];

const HotelGrid = memo(function HotelGrid({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const [sort, setSort] = useState<SortMode>('tier');
  const [activeTiers, setActiveTiers] = useState<Set<string>>(new Set(['luxury', 'mid', 'budget']));

  const rawHotels = useMemo(() => parseHotels(content), [content]);

  const sortedHotels = useMemo(() => {
    const filtered = rawHotels.filter((h) => !h.tier || activeTiers.has(h.tier));
    return sortHotels(filtered, sort);
  }, [rawHotels, sort, activeTiers]);

  const toggleTier = (tier: string) => {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Bed className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Hotels & Accommodation</h3>
          {rawHotels.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{rawHotels.length}</span>
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
            <div className="px-5 pb-5">
              {/* Sort + Filter Controls */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                  {TIERS.map((tier) => {
                    const isOn = activeTiers.has(tier.key);
                    return (
                      <button
                        key={tier.key}
                        onClick={() => toggleTier(tier.key)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-micro font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                          isOn
                            ? `${tier.bg} ${tier.color} border ${tier.border}`
                            : 'text-muted/30 bg-transparent border border-transparent'
                        }`}
                      >
                        <tier.icon className={`w-3 h-3 ${isOn ? tier.color : 'text-muted/30'}`} />
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSort(opt.key)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-micro font-mono font-bold transition-all duration-150 cursor-pointer ${
                        sort === opt.key
                          ? 'bg-background border border-border/40 text-night'
                          : 'text-muted/40 hover:text-muted/70'
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotel List */}
              <div className="space-y-3">
                {sortedHotels.map((hotel, idx) => {
                  const tierConfig = TIERS.find((t) => t.key === hotel.tier);
                  const descSentences = hotel.description?.split(/\.\s+/).filter(Boolean) || [];
                  const appeal = descSentences[0]?.replace(/₹[^.]*/, '').trim();
                  const rest = descSentences.slice(1).filter((s) => !/^₹|^Best for|^Price/i.test(s.trim())).join('. ');
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                    >
                      {tierConfig && (idx === 0 || sortedHotels[idx - 1]?.tier !== hotel.tier) && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${tierConfig.bg} border ${tierConfig.border} mb-2`}>
                          <tierConfig.icon className={`w-3 h-3 ${tierConfig.color}`} />
                          <span className={`text-micro font-mono font-bold uppercase tracking-wider ${tierConfig.color}`}>
                            {tierConfig.label}
                          </span>
                        </div>
                      )}
                      <div className="p-3 rounded-xl bg-background border border-border/30">
                        {hotel.price && (
                          <span className="inline-block mb-2 px-2.5 py-0.5 rounded-md bg-gold/10 border border-gold/20 text-micro font-mono font-bold text-gold">
                            {formatPrice(hotel.price)}
                          </span>
                        )}
                        <p className="text-body text-night font-semibold leading-tight">{hotel.name}</p>
                        {appeal && (
                          <p className="text-caption text-night/80 mt-1.5 leading-relaxed font-medium">{appeal}.</p>
                        )}
                        {rest && (
                          <p className="text-small text-muted/70 mt-1 leading-relaxed">{rest}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {sortedHotels.length === 0 && (
                  <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default HotelGrid;
