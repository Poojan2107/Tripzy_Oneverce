"use client";
import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const FALLBACK_BG = 'bg-secondary-surface';

export default function SafeImage({ src, alt = '', className = '', fallbackColor, width, height, priority, sizes }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageAlt = alt || '';

  if (failed || !src) {
    return (
      <div 
        className={`${className} ${FALLBACK_BG} flex items-center justify-center`}
        style={fallbackColor ? { backgroundColor: fallbackColor } : undefined}
      >
        <span className="text-micro font-mono text-muted/30 uppercase tracking-widest">
          {imageAlt.charAt(0) || '?'}
        </span>
      </div>
    );
  }

  if (width && height) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        width={width}
        height={height}
        className={`${className} transition-all duration-500 ease-out ${loaded ? 'blur-none' : 'blur-md bg-secondary-surface/40'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        loading={priority ? undefined : "lazy"}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      fill
      sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      className={`${className} transition-all duration-500 ease-out ${loaded ? 'blur-none' : 'blur-md bg-secondary-surface/40'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      loading={priority ? undefined : "lazy"}
      priority={priority}
    />
  );
}
