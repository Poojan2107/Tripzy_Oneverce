"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, ChevronDown, Plane, Bed, UtensilsCrossed, Ticket, ShoppingBag } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  transport: <Plane className="w-3 h-3" />,
  accommodation: <Bed className="w-3 h-3" />,
  food: <UtensilsCrossed className="w-3 h-3" />,
  activities: <Ticket className="w-3 h-3" />,
  miscellaneous: <ShoppingBag className="w-3 h-3" />,
};

function parseBudgetLines(content: string): { label: string; value: string; icon: React.ReactNode | null }[] {
  const knownCategories = ['transport', 'accommodation', 'food', 'activities', 'miscellaneous', 'total'];

  return content
    .split('\n')
    .map((line) => line.replace(/^[-–*•]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes(':') ? ':' : line.includes('–') ? '–' : line.includes('-') ? '-' : null;
      if (sep) {
        const idx = line.indexOf(sep);
        const label = line.slice(0, idx).trim().toLowerCase();
        const known = knownCategories.find((k) => label.includes(k));
        return {
          label: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
          icon: known ? (CATEGORY_ICONS[known] || null) : null,
        };
      }
      return { label: '', value: line, icon: null };
    });
}

function extractTotal(content: string): string | null {
  const match = content.match(/total[:\s]*[₹$€]\s*[\d,]+(?:\s*[–-]\s*[₹$€]?\s*[\d,]+)?/i);
  return match?.[0] || null;
}

export default function BudgetCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const lines = parseBudgetLines(content);
  const total = extractTotal(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <IndianRupee className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Budget</h3>
          {total && (
            <span className="text-micro font-mono text-gold font-bold">{total.replace(/^total[:\s]*/i, '')}</span>
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
              {lines.length > 0 ? (
                <div className="rounded-xl border border-border/30 overflow-hidden">
                  {lines.map((line, idx) => {
                    const isTotal = line.label.toLowerCase().includes('total');
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                          isTotal ? 'bg-gold/8 border-t-2 border-gold/20' : 'border-b border-border/20 last:border-b-0'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {line.icon && (
                            <span className="w-6 h-6 rounded-full bg-background border border-border/30 flex items-center justify-center shrink-0 text-muted/50">
                              {line.icon}
                            </span>
                          )}
                          <span className={`text-caption truncate ${isTotal ? 'text-night font-bold' : 'text-muted/70'}`}>
                            {line.label}
                          </span>
                        </div>
                        <span className={`text-caption shrink-0 ${isTotal ? 'text-gold font-bold text-body' : 'text-night font-semibold'}`}>
                          {line.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
