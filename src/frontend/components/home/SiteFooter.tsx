"use client";
import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-warm-gray/30 bg-night text-white/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-left space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display text-xl text-white font-bold tracking-tight lowercase">
                tripzy<span className="text-gold">.ai</span>
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">Atlas Vivant — Living Chapters of India</p>
            <p className="text-[10px] text-white/30 font-light leading-relaxed max-w-xs font-sans">
              Every destination tells a story. Explore chapter by chapter, journey by journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold block">Explore</span>
            <div className="space-y-1.5">
              {['Home', 'Explore Atlas', 'AI Companion', 'Saved'].map(link => (
                <a key={link} href="#" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="text-left space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold block">Info</span>
            <div className="space-y-1.5">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
                <a key={link} href="#" className="block text-[11px] text-white/40 hover:text-gold transition-colors font-light">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono uppercase tracking-wider text-white/25">
          <span>&copy; 2026 tripzy.ai — all journeys reserved</span>
          <span className="flex items-center gap-1">crafted with <Heart className="w-3 h-3 text-coral inline" /> for explorers</span>
        </div>
      </div>
    </footer>
  );
}
