"use client";
import { Handshake } from 'lucide-react';

export default function EtiquetteCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-surface border border-purple/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-3">
        <Handshake className="w-4 h-4 text-purple shrink-0" />
        <h3 className="font-display text-card text-night font-light">Local Ways</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const isDo = /^do\b|^always|^remember|^tip/i.test(cleaned);
          const isDont = /^don'?t\b|^avoid|^never/i.test(cleaned);
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${isDo ? 'bg-teal/50' : isDont ? 'bg-coral/50' : 'bg-muted/30'}`} />
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
