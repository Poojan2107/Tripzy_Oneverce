"use client";
import { Ban } from 'lucide-react';

export default function AvoidCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-[#FDF0F0] border border-coral/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-coral/30 via-coral/50 to-coral/30" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
          <Ban className="w-4 h-4 text-coral" />
        </div>
        <h3 className="font-display text-card text-night font-light">Things to Avoid</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-coral/40 mt-0.5 shrink-0 text-[10px]">⚠️</span>
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
