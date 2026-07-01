"use client";

import React from 'react';
import { X, ImageIcon } from 'lucide-react';
import { UploadButton } from '../../lib/uploadthing';

interface ImageUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  endpoint: 'destinationImage' | 'experienceImage';
  label?: string;
}

export default function ImageUploader({ currentUrl, onUpload, endpoint, label }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em] block">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input type="url" value={currentUrl} onChange={(e) => onUpload(e.target.value)} placeholder="Paste image URL..." className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors pr-10" />
          {currentUrl && (
            <button type="button" onClick={() => onUpload('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone hover:text-night cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <UploadButton
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res?.[0]?.ufsUrl) onUpload(res[0].ufsUrl);
          }}
          appearance={{
            button: `shrink-0 px-4 py-3 sm:py-2.5 rounded-xl border border-gold/30 bg-gold/5 text-gold text-micro font-bold uppercase tracking-[0.1em] cursor-pointer hover:bg-gold/10 transition-colors inline-flex items-center gap-1.5`,
          }}
        />
      </div>
      {currentUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-secondary-surface/30 group">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 flex items-center justify-center text-stone/40 pointer-events-none">
            <ImageIcon className="w-8 h-8" />
          </div>
        </div>
      )}
    </div>
  );
}
