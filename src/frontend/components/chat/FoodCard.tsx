"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, ChevronDown, Star, Building2, MapPin, ChefHat } from 'lucide-react';

const SUBCAT_ICONS: Record<string, React.ReactNode> = {
  signature: <Star className="w-3 h-3 text-gold" />,
  restaurant: <Building2 className="w-3 h-3 text-coral" />,
  street: <MapPin className="w-3 h-3 text-teal" />,
  specialty: <ChefHat className="w-3 h-3 text-purple" />,
};

function parseContent(text: string): { icon: React.ReactNode | null; items: { subcat: string | null; text: string }[] } {
  const lines = text.split('\n').filter(Boolean);
  const items: { subcat: string | null; text: string }[] = [];
  let currentSubcat: string | null = null;

  for (const line of lines) {
    const cleaned = line.replace(/^[-–*•🍽️🥘🍛🍜🍝]\s*/, '').trim();
    if (!cleaned) continue;

    const subcatMatch = cleaned.match(/^\*\*(.+?)\*\*[:\s]*$/);
    if (subcatMatch) {
      currentSubcat = subcatMatch[1].toLowerCase();
      continue;
    }

    items.push({ subcat: currentSubcat, text: cleaned });
  }

  const allSubcats = [...new Set(items.map((i) => i.subcat).filter(Boolean))];
  const topSubcat = allSubcats.length === 1 ? allSubcats[0] : null;

  let topIcon: React.ReactNode | null = null;
  if (topSubcat) {
    for (const [key, icon] of Object.entries(SUBCAT_ICONS)) {
      if (topSubcat.includes(key)) {
        topIcon = icon;
        break;
      }
    }
  }

  return { icon: topIcon, items };
}

export default function FoodCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const { icon: subcatIcon, items } = parseContent(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <UtensilsCrossed className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Food & Dining</h3>
          {items.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{items.length} picks</span>
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
            <div className="px-5 pb-5 space-y-2">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const isNewSubcat = idx === 0 || (item.subcat && item.subcat !== items[idx - 1]?.subcat);
                  return (
                    <div key={idx}>
                      {isNewSubcat && item.subcat && (
                        <div className="flex items-center gap-1.5 pt-2 pb-1">
                          {SUBCAT_ICONS[Object.keys(SUBCAT_ICONS).find((k) => item.subcat?.includes(k)) || ''] || null}
                          <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">
                            {item.subcat}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/30">
                        <span className="w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                          <span className="text-micro text-coral font-bold">{idx + 1}</span>
                        </span>
                        <span className="text-caption text-night/80 leading-relaxed">{item.text}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
