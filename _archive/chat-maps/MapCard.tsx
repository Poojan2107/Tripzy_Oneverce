"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronDown } from 'lucide-react';
import { MapView, type MapMarker } from './MapView';

interface MapCardProps {
  content: string;
  markers?: MapMarker[];
  onPinClick?: (sectionType: string) => void;
  highlightedSection?: string | null;
}

export default function MapCard({ content, markers, onPinClick, highlightedSection }: MapCardProps) {
  const [expanded, setExpanded] = useState(true);

  if (!content && (!markers || markers.length === 0)) return null;

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Map className="w-4 h-4 text-teal" />
          <h3 className="font-display text-card text-night font-light">Route & Map</h3>
          {markers && markers.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{markers.length} pins</span>
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
            <div className="px-5 pb-5 space-y-3">
              {markers && markers.length > 0 ? (
                <MapView
                  markers={markers}
                  onPinClick={onPinClick}
                />
              ) : (
                <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
              {markers && markers.length > 0 && content && (
                <p className="text-small text-muted/50 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
