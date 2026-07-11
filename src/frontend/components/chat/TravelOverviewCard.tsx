"use client";
import { Compass, MapPin, Calendar, User, WandSparkles, ArrowRight } from 'lucide-react';
import { useChat } from './ChatContext';
import { parseOverview } from '../../lib/parseOverview';

export default function TravelOverviewCard({ content }: { content: string }) {
  const { tours, onShowTourDetail } = useChat();
  if (!content) return null;

  const { lead, highlights, bestFor, duration, vibe } = parseOverview(content);

  const matchedTour = tours.find((t) => {
    const c = content.toLowerCase();
    return c.includes(t.title.toLowerCase()) || c.includes(t.location.toLowerCase().split(',')[0]);
  });

  return (
    <div className="bg-gradient-to-br from-surface to-[#FDFBF5] border border-border/50 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-coral to-teal" />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-card text-night font-light leading-tight">Journey Overview</h3>
          </div>
        </div>

        <p className="text-body text-night/80 leading-relaxed mb-4 font-light italic">{lead}</p>

        {(bestFor || duration || vibe) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {bestFor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 text-micro font-bold uppercase tracking-wider text-gold/80">
                <User className="w-3 h-3" /> {bestFor}
              </span>
            )}
            {duration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/8 border border-teal/15 text-micro font-bold uppercase tracking-wider text-teal/80">
                <Calendar className="w-3 h-3" /> {duration}
              </span>
            )}
            {vibe && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/8 border border-coral/15 text-micro font-bold uppercase tracking-wider text-coral/80">
                <WandSparkles className="w-3 h-3" /> {vibe}
              </span>
            )}
          </div>
        )}

        {highlights.length > 0 && (
          <div className="space-y-1 mb-3">
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/40">Highlights</span>
            <div className="space-y-1">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5 shrink-0">✦</span>
                  <span className="text-caption text-muted/80 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchedTour && (
          <button
            onClick={() => onShowTourDetail(matchedTour)}
            className="inline-flex items-center gap-1.5 text-micro font-mono font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors cursor-pointer mt-1"
          >
            View Chapter <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
