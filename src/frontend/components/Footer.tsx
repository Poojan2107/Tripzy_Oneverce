"use client";
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-night text-white/60 pb-[calc(var(--nav-bottom-height)+env(safe-area-inset-bottom,12px))] md:pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-12 md:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-left space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display text-xl text-white font-bold tracking-tight lowercase">
                travebie<span className="text-gold">.ai</span>
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">Atlas Vivant</p>
            <p className="text-[10px] text-white/30 font-light leading-relaxed max-w-xs font-sans">
              Every destination tells a story. Explore chapter by chapter, journey by journey.
            </p>
          </div>

          {/* Explore */}
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold block">Navigate</span>
            <div className="space-y-1.5">
              {[
                { label: 'Explore Atlas', href: '#explore' },
                { label: 'AI Companion', href: '#ai-planner' },
                { label: 'Passport', href: '#saved' },
              ].map(link => (
                <a key={link.label} href={link.href} className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold block">Info</span>
            <div className="space-y-1.5">
              <a href="/privacy" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">Privacy</a>
              <a href="/terms" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">Terms</a>
              <a href="/contact" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">Contact</a>
            </div>
          </div>

          {/* Connect */}
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold block">Journey</span>
            <div className="space-y-1.5">
              {['Varanasi', 'Kerala', 'Ladakh', 'Rajasthan'].map(dest => (
                <a key={dest} href="#explore" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">{dest}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono uppercase tracking-wider text-white/25">
          <span>&copy; {year} travebie.ai — all journeys reserved</span>
          <span className="flex items-center gap-1">crafted with <Heart className="w-3 h-3 text-coral inline" /> for explorers</span>
        </div>
      </div>
    </footer>
  );
}