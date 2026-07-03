"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useChat } from './ChatContext';

function parseExperiences(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-–*•⭐✨🎭🎨🏛️]\s*/, '').trim())
    .filter(Boolean);
}

export default function ExperiencesCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const { tours, onShowTourDetail } = useChat();
  const items = parseExperiences(content);

  // Find any matching tour
  const matchedTour = tours.find((t) => content.toLowerCase().includes(t.title.toLowerCase()));

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Local Experiences</h3>
          {items.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{items.length}</span>
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
                items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/30">
                    <Sparkles className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
                    <span className="text-caption text-night/80 leading-relaxed">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
              {matchedTour && (
                <button
                  onClick={() => onShowTourDetail(matchedTour)}
                  className="mt-2 inline-flex items-center gap-1.5 text-micro font-mono font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors cursor-pointer"
                >
                  View destination details →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
