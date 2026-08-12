"use client";
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-night text-white/60 pb-[calc(var(--nav-bottom-height)+var(--safe-bottom))] md:pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-12 md:pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="text-left space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-logo text-card text-white font-bold tracking-tight lowercase">
                travebie<span className="text-gold">.ai</span>
              </span>
            </div>
            <p className="text-meta font-mono text-white/40">Atlas Vivant · India</p>
            <p className="text-meta text-white/35 leading-relaxed max-w-xs">
              Every destination tells a story. Explore chapter by chapter, journey by journey.
            </p>
          </div>

          {/* Navigate */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block uppercase tracking-wider">Navigate</span>
            <div className="space-y-2">
              {[
                { label: 'Explore Atlas', href: '/#explore' },
                { label: 'AI Planner', href: '/#ai-planner' },
                { label: 'Digital Passport', href: '/#saved' },
                { label: 'Contact Us', href: '/contact' },
              ].map(link => (
                <a key={link.label} href={link.href} className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* North & West Chapters */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block uppercase tracking-wider">North & West</span>
            <div className="space-y-2">
              {[
                { label: 'Varanasi Spiritual', href: '/destination/varanasi-spiritual' },
                { label: 'Udaipur Mewar', href: '/destination/udaipur-mewar' },
                { label: 'Ladakh Passes', href: '/destination/ladakh-passes' },
                { label: 'Jaisalmer Fort', href: '/destination/jaisalmer-fort' },
                { label: 'Kashmir Meadows', href: '/destination/kashmir-meadows' },
                { label: 'Kutch White Desert', href: '/destination/kutch-salt' },
              ].map(dest => (
                <a key={dest.label} href={dest.href} className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">
                  {dest.label}
                </a>
              ))}
            </div>
          </div>

          {/* South & East Chapters */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block uppercase tracking-wider">South & East</span>
            <div className="space-y-2">
              {[
                { label: 'Kerala Backwaters', href: '/destination/kerala-houseboats' },
                { label: 'Goa Coastal', href: '/destination/goa-beach' },
                { label: 'Hampi Ruins', href: '/destination/hampi-ruins' },
                { label: 'Munnar Tea Hills', href: '/destination/munnar-tea' },
                { label: 'Cherrapunji Roots', href: '/destination/cherrapunji-roots' },
                { label: 'Andaman Reefs', href: '/destination/andaman-reefs' },
              ].map(dest => (
                <a key={dest.label} href={dest.href} className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">
                  {dest.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal & Info */}
          <div className="text-left space-y-3">
            <span className="text-meta font-mono text-white/50 block uppercase tracking-wider">Legal</span>
            <div className="space-y-2">
              <a href="/privacy" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">Privacy Policy</a>
              <a href="/terms" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">Terms of Service</a>
              <a href="/sitemap.xml" className="block text-caption text-white/40 hover:text-gold transition-colors font-medium">XML Sitemap</a>
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