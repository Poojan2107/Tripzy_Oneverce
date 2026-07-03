"use client";
import { Sparkles } from 'lucide-react';
import { useChat } from './ChatContext';

export default function HiddenGemsCard({ content }: { content: string }) {
  const { tours, onShowTourDetail } = useChat();
  if (!content) return null;

  const matchedTour = tours.find((t) =>
    content.toLowerCase().includes(t.title.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-surface to-[#FDF8F0] border border-amber/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber/40 via-gold/60 to-amber/40" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber" />
        </div>
        <h3 className="font-display text-card text-night font-light">Hidden Gems</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const isHeader = /^[-–*•]\s*\*\*(.+?)\*\*/.test(line) || /^\d+[.)]/.test(line);
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-amber/40 mt-1 shrink-0">{isHeader ? '✨' : '•'}</span>
              <p className={`text-caption leading-relaxed ${isHeader ? 'text-night font-semibold' : 'text-muted/80'}`}>
                {cleaned}
              </p>
            </div>
          );
        })}
      </div>
      {matchedTour && (
        <button
          onClick={() => onShowTourDetail(matchedTour)}
          className="mt-3 text-micro font-mono font-bold uppercase tracking-wider text-amber hover:text-amber/80 transition-colors cursor-pointer"
        >
          → Discover more secrets
        </button>
      )}
    </div>
  );
}
