"use client";
import { Calendar } from 'lucide-react';

export default function FestivalsCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-[#FDF8F0] border border-pink/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink/30 via-coral/40 to-pink/30" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-pink/10 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-pink" />
        </div>
        <h3 className="font-display text-card text-night font-light">Festivals & Events</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const dateMatch = cleaned.match(/(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[–-]\s*|\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December))\b/i);
          const isHeader = /^\*\*.+\*\*/.test(cleaned) || /^\d+[.)]/.test(cleaned);
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isHeader ? '' : 'pl-4'}`}>
              <span className="shrink-0 mt-0.5 text-[10px]">{dateMatch ? '🎉' : isHeader ? '📅' : '•'}</span>
              <div>
                {dateMatch && (
                  <span className="text-micro text-pink/60 font-mono mr-2">{dateMatch[0].replace('–', ' – ')}</span>
                )}
                <p className={`text-caption leading-relaxed ${isHeader ? 'text-night font-semibold' : 'text-muted/80'}`}>
                  {cleaned.replace(dateMatch?.[0] || '', '').trim() || cleaned}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
