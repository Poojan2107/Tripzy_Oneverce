"use client";
import { Camera } from 'lucide-react';

export default function PhotographyCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-[#F0F4FD] border border-blue/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue/30 via-blue/50 to-blue/30" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-blue" />
        </div>
        <h3 className="font-display text-card text-night font-light">Photography Spots</h3>
      </div>
      <div className="space-y-2.5">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const isItem = /^\d+[.)]/.test(cleaned) || /^\*\*.+\*\*/.test(cleaned);
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isItem ? '' : 'pl-4'}`}>
              <span className="text-blue/30 mt-0.5 shrink-0 text-[10px]">{isItem ? '📷' : '•'}</span>
              <p className="text-caption text-muted/80 leading-relaxed">{cleaned}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
