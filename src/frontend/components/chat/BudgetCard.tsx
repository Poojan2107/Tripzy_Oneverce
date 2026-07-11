"use client";
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, ChevronDown } from 'lucide-react';

interface BudgetLine {
  label: string;
  value: string;
}

function parseBudgetLines(content: string): BudgetLine[] {
  return content
    .split('\n')
    .map((line) => line.replace(/^[-–*•]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes(':') ? ':' : line.includes('–') ? '–' : line.includes('-') ? '-' : null;
      if (sep) {
        const idx = line.indexOf(sep);
        const label = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        return { label, value };
      }
      return { label: '', value: line };
    });
}

const BudgetCard = memo(function BudgetCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = parseBudgetLines(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <IndianRupee className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Budget</h3>
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
            <div className="px-4 pb-4">
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
                        <span className={`text-caption truncate ${isTotal ? 'text-night font-bold' : 'text-muted/70'}`}>
                          {line.label}
                        </span>
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
});

export default BudgetCard;
