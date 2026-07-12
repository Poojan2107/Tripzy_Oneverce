"use client";
import { useMemo } from 'react';
import { parseOverview } from '../../lib/parseOverview';
import { getDestinationImage } from '../../lib/getDestinationImage';
import { findLocation } from '../../lib/placeData';

import SafeImage from '../ui/SafeImage';

function extractDestinationName(content: string): string {
  const match = findLocation(content);
  if (match) {
    const parts = match.name.split(',');
    const first = parts[0]?.trim();
    if (first) return first;
  }
  const lines = content.split('\n').filter(Boolean);
  for (const line of lines) {
    const cleaned = line.replace(/^[-–*•#]\s*/, '').trim();
    if (cleaned && !cleaned.startsWith('**') && cleaned.length < 30) {
      const dm = findLocation(cleaned);
      if (dm) {
        const parts = dm.name.split(',');
        const first = parts[0]?.trim();
        if (first) return first;
      }
    }
  }
  return '';
}

export default function DestinationHero({ content }: { content: string }) {
  const { lead, bestFor, duration, vibe } = useMemo(() => parseOverview(content), [content]);
  const destinationName = useMemo(() => extractDestinationName(content), [content]);
  const img = useMemo(() => getDestinationImage(destinationName), [destinationName]);

  if (!content) return null;

  const chips = [
    ...(bestFor ? [{ label: bestFor, key: 'bestfor' }] : []),
    ...(duration ? [{ label: duration, key: 'duration' }] : []),
    ...(vibe ? [{ label: vibe, key: 'vibe' }] : []),
  ];

  return (
    <div className="overflow-hidden rounded-2xl">
      <div className={`h-56 sm:h-72 lg:h-80 bg-gradient-to-br ${img.gradient} relative`}>
        {img.image && (
          <SafeImage
            src={img.image}
            alt={destinationName || 'Destination'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight drop-shadow-sm">{destinationName || 'Your Destination'}</h2>
        </div>
      </div>
      <div className="pt-4 pb-1 px-1 space-y-3">
        {lead && (
          <p className="text-body text-night/80 leading-relaxed font-light italic">{lead}</p>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span key={chip.key} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold/6 text-micro font-medium text-muted/60">{chip.label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
