"use client";
import { Calendar } from 'lucide-react';

export default function FestivalsCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-surface border border-pink/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-3">
        <Calendar className="w-4 h-4 text-pink shrink-0" />
        <h3 className="font-display text-card text-night font-light">Festivals</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const dateMatch = cleaned.match(/(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[–-]\s*|\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December))\b/i);
          const isHeader = /^\*\*.+\*\*/.test(cleaned) || /^\d+[.)]/.test(cleaned);
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isHeader ? '' : 'pl-4'}`}>
              <span className="w-1 h-1 rounded-full bg-pink/30 mt-2 shrink-0" />
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
