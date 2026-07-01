"use client";

import React, { useState, useEffect } from 'react';
import { Image, ExternalLink } from 'lucide-react';
import { getMediaLibrary } from '../../../backend/actions/adminActions';

export default function AdminMediaTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await getMediaLibrary();
      if (r.success) setImages(r.data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="text-center text-stone py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-2" />Loading media library...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-4 h-4 text-gold" />
        <span className="text-micro font-bold uppercase tracking-wider text-stone">Media Library</span>
        <span className="text-xs text-stone ml-auto">{images.length} images</span>
      </div>
      {images.length === 0 && <p className="text-stone text-sm">No images found.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <a key={`${img.id}-${i}`} href={img.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone/10 border border-border hover:border-gold/40 transition-colors">
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <div className="flex items-center gap-1 text-white text-[10px] truncate w-full">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{img.name}</span>
              </div>
            </div>
            <span className="absolute top-1.5 right-1.5 text-[9px] uppercase font-bold bg-black/50 text-white px-1.5 py-0.5 rounded">{img.source}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
