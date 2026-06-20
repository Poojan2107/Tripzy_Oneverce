"use client";
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackColor?: string;
}

const FALLBACK_BG = 'bg-cream';

export default function SafeImage({ src, alt, className = '', fallbackColor }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div 
        className={`${className} ${FALLBACK_BG} flex items-center justify-center`}
        style={fallbackColor ? { backgroundColor: fallbackColor } : undefined}
      >
        <span className="text-[8px] font-mono text-muted/30 uppercase tracking-widest">
          {alt?.charAt(0) || '?'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
