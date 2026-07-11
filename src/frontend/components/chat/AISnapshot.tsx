"use client";
import { useMemo } from 'react';
import { Calendar, User, WandSparkles, DollarSign } from 'lucide-react';
import { parseOverview } from '../../lib/parseOverview';

export default function AISnapshot({ content }: { content: string }) {
  const { bestFor, duration, vibe, highlights } = useMemo(() => parseOverview(content), [content]);

  if (!content || (!bestFor && !duration && !vibe && highlights.length === 0)) return null;

  const metadata = [
    ...(bestFor ? [{ icon: <User className="w-3.5 h-3.5" />, value: bestFor }] : []),
    ...(duration ? [{ icon: <Calendar className="w-3.5 h-3.5" />, value: duration }] : []),
    ...(vibe ? [{ icon: <WandSparkles className="w-3.5 h-3.5" />, value: vibe }] : []),
  ];

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm p-4">
      {metadata.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {metadata.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/30">
              <span className="text-muted/50 shrink-0">{item.icon}</span>
              <p className="text-caption text-night font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div>
          <p className="text-caption text-muted/80 leading-relaxed">
            {highlights.join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}
