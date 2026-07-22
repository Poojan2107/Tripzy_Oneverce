"use client";
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-night text-white/60 pb-[calc(var(--nav-bottom-height)+var(--safe-bottom))] md:pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-12 md:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-left space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-logo text-card text-white font-bold tracking-tight lowercase">
                travebie<span className="text-gold">.ai</span>
              </span>
            </div>
            <p className="text-meta font-mono text-white/40">Atlas Vivant</p>
            <p className="text-meta text-white/35 leading-relaxed max-w-xs">
              Every destination tells a story. Explore chapter by chapter, journey by journey.
            </p>
          </div>

          {/* Explore */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block">Navigate</span>
            <div className="space-y-2">
              {[
                { label: 'Explore Atlas', href: '#explore' },
                { label: 'AI Companion', href: '#ai-planner' },
                { label: 'Passport', href: '#saved' },
              ].map(link => (
                <a key={link.label} href={link.href} className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block">Info</span>
            <div className="space-y-2">
              <a href="/privacy" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">Privacy</a>
              <a href="/terms" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">Terms</a>
              <a href="/contact" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">Contact</a>
            </div>
          </div>

          {/* Connect */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block">Journey</span>
            <div className="space-y-2">
              {['Varanasi', 'Kerala', 'Ladakh', 'Rajasthan'].map(dest => (
                <a key={dest} href="#explore" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">{dest}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-meta font-mono text-white/25">
          <span>&copy; {year} travebie.ai — all journeys reserved</span>
          <span className="flex items-center gap-2 text-white/40">
            <img
              src="/images/oneverce-icon.png"
              alt="Oneverce Solution Logo"
              className="h-6 w-auto object-contain inline-block filter drop-shadow-md brightness-110"
            />
            <span>Created By <span className="font-semibold text-white/70">Oneverce Solution</span></span>
          </span>
        </div>
      </div>
    </footer>
  );
}