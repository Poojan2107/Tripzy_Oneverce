"use client";
import { Sparkles } from 'lucide-react';

interface EmptyPassportStateProps {
  onNavigate: () => void;
  type: 'wishlist' | 'itineraries';
}

export default function EmptyPassportState({ onNavigate, type }: EmptyPassportStateProps) {
  const content = {
    wishlist: {
      tag: "saved chapters",
      title: "your passport awaits its first chapter",
      desc: "Begin exploring India and start collecting stories.",
      btnText: "Explore Atlas",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gold">
          <circle cx="32" cy="32" r="26" stroke="#F4B63D" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="21" stroke="#F4B63D" strokeWidth="0.75" strokeDasharray="3,3" />
          <path d="M32 10L35 29L32 32L29 29Z" fill="#F4B63D" />
          <path d="M32 54L35 35L32 32L29 35Z" fill="#F4B63D" fillOpacity="0.4" />
          <path d="M54 32L35 35L32 32L35 29Z" fill="#F4B63D" fillOpacity="0.7" />
          <path d="M10 32L29 35L32 32L29 29Z" fill="#F4B63D" fillOpacity="0.3" />
          <circle cx="32" cy="32" r="3" fill="#0E1B26" />
        </svg>
      )
    },
    itineraries: {
      tag: "journey collection",
      title: "no custom journeys archived yet",
      desc: "Consult our AI travel companion to design your first custom day-by-day odyssey.",
      btnText: "Craft First Journey",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gold">
          <rect x="14" y="10" width="36" height="44" rx="3" stroke="#F4B63D" strokeWidth="1.5" />
          <line x1="20" y1="18" x2="44" y2="18" stroke="#F4B63D" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="20" y1="26" x2="38" y2="26" stroke="#F4B63D" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="20" y1="34" x2="44" y2="34" stroke="#F4B63D" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="20" y1="42" x2="32" y2="42" stroke="#F4B63D" strokeWidth="1.5" strokeOpacity="0.8" />
          <path d="M10 14H14" stroke="#0E1B26" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 22H14" stroke="#0E1B26" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 30H14" stroke="#0E1B26" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 38H14" stroke="#0E1B26" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 46H14" stroke="#0E1B26" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  }[type];
 
  return (
    <div className="text-center py-16 bg-gradient-to-br from-white/95 to-[#FFFDF9]/65 border border-border/20 rounded-2xl max-w-lg mx-auto p-8 shadow-[var(--shadow-sm)] relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-teal/[0.02] pointer-events-none" />
      
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white rounded-md border border-border/15 shadow-sm transition-transform duration-500 hover:rotate-2">
        {content.illustration}
      </div>
      
      <span className="text-meta font-mono text-gold block mb-2">
        {content.tag}
      </span>
      <h3 className="font-display text-heading text-night lowercase font-light leading-none mb-3">
        {content.title}
      </h3>
      <p className="text-body text-muted/65 font-light max-w-xs mx-auto leading-relaxed mb-8">
        {content.desc}
      </p>
      
      <button
        onClick={onNavigate}
        className="btn btn-night h-11 px-5 rounded-md text-caption flex items-center gap-2 cursor-pointer shadow-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
        <span>{content.btnText}</span>
      </button>
    </div>
  );
}
