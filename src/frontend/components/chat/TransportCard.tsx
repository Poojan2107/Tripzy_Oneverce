"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, ChevronDown } from 'lucide-react';

function parseTips(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-–*•🚗🚌🚂✈️🚢🛵]\s*/, '').trim())
    .filter(Boolean);
}

export default function TransportCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const tips = parseTips(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Train className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Transport</h3>
          {tips.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{tips.length}</span>
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
              {tips.length > 0 ? (
                tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-coral/40 mt-2 shrink-0" />
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
