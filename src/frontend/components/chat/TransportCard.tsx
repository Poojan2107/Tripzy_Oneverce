"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, ChevronDown, Plane, Bus, Car, Ship } from 'lucide-react';

const MODE_ICONS: Record<string, React.ReactNode> = {
  train: <Train className="w-3.5 h-3.5" />,
  flight: <Plane className="w-3.5 h-3.5" />,
  bus: <Bus className="w-3.5 h-3.5" />,
  taxi: <Car className="w-3.5 h-3.5" />,
  cab: <Car className="w-3.5 h-3.5" />,
  ferry: <Ship className="w-3.5 h-3.5" />,
  boat: <Ship className="w-3.5 h-3.5" />,
  auto: <Car className="w-3.5 h-3.5" />,
};

function parseModes(text: string): { mode: string; detail: string }[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-–*•🚗🚌🚂✈️🚢🛵]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && colonIdx < 20) {
        return { mode: line.slice(0, colonIdx).trim(), detail: line.slice(colonIdx + 1).trim() };
      }
      return { mode: '', detail: line };
    });
}

function getModeKey(text: string): string {
  const lower = text.toLowerCase();
  for (const key of Object.keys(MODE_ICONS)) {
    if (lower.includes(key)) return key;
  }
  return '';
}

export default function TransportCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const modes = parseModes(content);
  const hasStructured = modes.some((m) => m.mode);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Train className="w-4 h-4 text-coral" />
          <h3 className="font-display text-card text-night font-light">Transport</h3>
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
              {modes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {modes.map((item, idx) => {
                    const modeKey = getModeKey(item.mode || item.detail);
                    return (
                      <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border/30 text-caption text-night/80">
                        {modeKey && <span className="text-coral/70">{MODE_ICONS[modeKey]}</span>}
                        <span className="font-medium">{item.mode || item.detail}</span>
                        {item.mode && item.detail && (
                          <span className="text-muted/60 ml-1 text-micro">{item.detail}</span>
                        )}
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
