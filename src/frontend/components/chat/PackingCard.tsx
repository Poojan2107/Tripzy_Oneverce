"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';

function parseItems(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-–*•✅☐☑]\s*/, '').replace(/^\[[x\s]\]\s*/i, '').trim())
    .filter(Boolean);
}

export default function PackingCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const items = parseItems(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal" />
          <h3 className="font-display text-card text-night font-light">Packing Essentials</h3>
          {items.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{items.length} items</span>
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
              {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-background border border-border/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal/50 shrink-0" />
                      <span className="text-caption text-night/80">{item}</span>
                    </div>
                  ))}
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
