"use client";
import { Shield } from 'lucide-react';

export default function EmergencyCard({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n').filter(Boolean);

  return (
    <div className="bg-surface border border-amber/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-3">
        <Shield className="w-4 h-4 text-red shrink-0" />
        <h3 className="font-display text-card text-night font-light">Keep Safe</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {lines.map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const colonIdx = cleaned.indexOf(':');
          if (colonIdx > 0) {
            const label = cleaned.slice(0, colonIdx).trim();
            const value = cleaned.slice(colonIdx + 1).trim();
            return (
              <div key={i} className="flex flex-col p-2.5 rounded-xl bg-background border border-border/30">
                <span className="text-micro text-muted/50 font-mono uppercase tracking-wider">{label}</span>
                <span className="text-caption text-night font-semibold mt-0.5">{value}</span>
              </div>
            );
          }
          return (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-background border border-border/30 col-span-full">
              <Shield className="w-3 h-3 text-red/40 mt-0.5 shrink-0" />
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
