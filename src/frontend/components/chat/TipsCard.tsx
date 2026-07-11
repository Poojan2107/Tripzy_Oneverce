"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown } from 'lucide-react';

function parseTips(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-–*•💡⭐🔑]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(Boolean);
}

export default function TipsCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const tips = parseTips(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Tips</h3>
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
              {tips.length > 0 ? (
                tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/30">
                    <span className="w-1 h-1 rounded-full bg-gold/40 mt-2 shrink-0" />
                    <span className="text-caption text-night/80 leading-relaxed">{tip}</span>
                  </div>
                ))
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
