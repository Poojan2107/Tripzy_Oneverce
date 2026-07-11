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

const PRICE_REGEX = /[₹$€]\s*\d[\d,]*\s*(?:-\s*[₹$€]\s*\d[\d,]*)?/;

function parseContent(text: string): { icon: React.ReactNode | null; items: { subcat: string | null; name: string; price: string; description: string }[] } {
  const lines = text.split('\n').filter(Boolean);
  const items: { subcat: string | null; name: string; price: string; description: string }[] = [];
  let currentSubcat: string | null = null;

  for (const line of lines) {
    const cleaned = line.replace(/^[-–*•🍽️🥘🍛🍜🍝]\s*/, '').trim();
    if (!cleaned) continue;

    const subcatMatch = cleaned.match(/^\*\*(.+?)\*\*[:\s]*$/);
    if (subcatMatch) {
      currentSubcat = subcatMatch[1].toLowerCase();
      continue;
    }

    const priceMatch = cleaned.match(PRICE_REGEX);
    const price = priceMatch ? priceMatch[0] : '';
    const withoutPrice = priceMatch ? cleaned.replace(PRICE_REGEX, '').replace(/\s{2,}/, ' ').trim() : cleaned;

    const dashIdx = withoutPrice.indexOf('—');
    const name = dashIdx > 0 ? withoutPrice.slice(0, dashIdx).trim() : withoutPrice;
    const description = dashIdx > 0 ? withoutPrice.slice(dashIdx + 1).replace(/^–?\s*/, '').trim() : '';

    items.push({ subcat: currentSubcat, name: name || withoutPrice, price, description });
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
  const [expanded, setExpanded] = useState(false);
  const { items } = parseContent(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <UtensilsCrossed className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Food</h3>
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
            <div className="px-4 pb-4 space-y-2">
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
                      <div className="p-3 rounded-xl bg-background border border-border/30">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-caption text-night font-semibold leading-snug">{item.name}</span>
                          {item.price && (
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-coral/8 border border-coral/15 text-micro font-mono font-bold text-coral/80">{item.price}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-micro text-muted/70 leading-relaxed mt-1">{item.description}</p>
                        )}
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
