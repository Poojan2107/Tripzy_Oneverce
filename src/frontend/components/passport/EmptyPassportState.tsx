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
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-teal/40">
          <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3"/>
          <rect x="42" y="16" width="10" height="12" stroke="currentColor" strokeWidth="1.2" fill="rgba(24,182,201,0.05)"/>
          <circle cx="28" cy="32" r="10" fill="#18B6C9" fillOpacity={0.08} stroke="#18B6C9" strokeWidth={1.5}/>
          <circle cx="28" cy="32" r="7" stroke="#18B6C9" strokeWidth={0.75} strokeDasharray="2,2"/>
          <path d="M28 28C28 28 25.5 31.5 28 35.5C30.5 31.5 28 28 28 28Z" fill="#18B6C9" fillOpacity={0.25}/>
          <path d="M28 30.5C28 30.5 24 32 28 35C32 32 28 30.5 28 30.5Z" fill="#18B6C9" fillOpacity={0.25}/>
        </svg>
      )
    },
    itineraries: {
      tag: "journey collection",
      title: "no custom journeys archived yet",
      desc: "Consult our AI travel companion to design your first custom day-by-day odyssey.",
      btnText: "Craft First Journey",
      illustration: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-teal/35">
          <path d="M10 12H30V52H10C8.89543 52 8 51.1046 8 50V14C8 12.8954 8.89543 12 10 12Z" stroke="currentColor" strokeWidth={1.2}/>
          <path d="M54 12H34V52H54C55.1046 52 56 51.1046 56 50V14C56 12.8954 55.1046 12 54 12Z" stroke="currentColor" strokeWidth={1.2}/>
          <path d="M30 16H34M30 24H34M30 32H34M30 40H34M30 48H34" stroke="currentColor" strokeWidth={2}/>
          <circle cx="44" cy="32" r="8" stroke="currentColor" strokeWidth={0.75}/>
          <path d="M44 21V43M33 32H55" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2,2"/>
        </svg>
      )
    }
  }[type];

  return (
    <div className="text-center py-16 bg-white border border-border/70 rounded-2xl max-w-lg mx-auto p-8 shadow-md relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-teal/[0.02] pointer-events-none" />
      
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-background rounded-md border border-border/20 transition-transform duration-500 hover:rotate-2">
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
