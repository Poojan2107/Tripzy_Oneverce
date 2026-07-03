"use client";
import { Handshake } from 'lucide-react';

export default function EtiquetteCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-[#F5F0FD] border border-purple/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple/30 via-purple/50 to-purple/30" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
          <Handshake className="w-4 h-4 text-purple" />
        </div>
        <h3 className="font-display text-card text-night font-light">Local Etiquette</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const isDo = /^do\b|^always|^remember|^tip/i.test(cleaned);
          const isDont = /^don'?t\b|^avoid|^never/i.test(cleaned);
          const icon = isDo ? '✅' : isDont ? '❌' : '•';
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5 text-[10px]">{icon}</span>
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
