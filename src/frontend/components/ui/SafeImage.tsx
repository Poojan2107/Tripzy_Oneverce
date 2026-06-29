"use client";
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackColor?: string;
}

const FALLBACK_BG = 'bg-secondary-surface';

export default function SafeImage({ src, alt, className = '', fallbackColor }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div 
        className={`${className} ${FALLBACK_BG} flex items-center justify-center`}
        style={fallbackColor ? { backgroundColor: fallbackColor } : undefined}
      >
        <span className="text-micro font-mono text-muted/30 uppercase tracking-widest">
          {alt?.charAt(0) || '?'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-all duration-500 ease-out ${loaded ? 'blur-none' : 'blur-md bg-secondary-surface/40'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

