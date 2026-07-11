"use client";
import { Ban } from 'lucide-react';

export default function AvoidCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-surface border border-coral/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-3">
        <Ban className="w-4 h-4 text-coral shrink-0" />
        <h3 className="font-display text-card text-night font-light">Avoid</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-coral/40 mt-2 shrink-0" />
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
