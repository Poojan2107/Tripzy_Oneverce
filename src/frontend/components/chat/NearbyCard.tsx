"use client";
import { MapPin } from 'lucide-react';

export default function NearbyCard({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-[#F0FDF4] border border-teal/20 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal/30 via-teal/50 to-teal/30" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-teal" />
        </div>
        <h3 className="font-display text-card text-night font-light">Nearby Destinations</h3>
      </div>
      <div className="space-y-2">
        {content.split('\n').filter(Boolean).map((line, i) => {
          const cleaned = line.replace(/^[-–*•\s]+/, '').trim();
          if (!cleaned) return null;
          const distMatch = cleaned.match(/(\d[\d.]*)\s*(km|kilometers?|kms?|hours?|mins?)/i);
          const isHeader = /^\*\*.+\*\*/.test(cleaned) || /^\d+[.)]/.test(cleaned);
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isHeader ? '' : 'pl-4'}`}>
              <span className="text-teal/30 mt-0.5 shrink-0 text-[10px]">{isHeader ? '📍' : '•'}</span>
              <div className="flex-1">
                <p className={`text-caption leading-relaxed ${isHeader ? 'text-night font-semibold' : 'text-muted/80'}`}>
                  {cleaned}
                </p>
                {distMatch && (
                  <span className="text-micro text-teal/60 font-mono mt-0.5 inline-block">
                    {distMatch[0]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
