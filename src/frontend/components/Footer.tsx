import { Compass, Mail, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night border-t border-warm-gray/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display text-xl font-light text-white lowercase tracking-tight">tripzy</span>
            </div>
            <p className="text-[11px] text-white/40 font-light leading-relaxed max-w-[220px]">
              AI-powered travel companion for exploring India through handcrafted chapters and curated experiences.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Explore Atlas', href: '#explore' },
                { label: 'Journey Builder', href: '#ai-planner' },
                { label: 'Passport', href: '#saved' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-4">Destinations</h4>
            <ul className="space-y-2.5">
              {[
                'Varanasi', 'Kerala', 'Ladakh', 'Udaipur', 'Jaisalmer', 'Goa',
              ].map((dest) => (
                <li key={dest}>
                  <Link
                    href={`#explore`}
                    className="text-[11px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/contact" className="text-[11px] text-white/50 hover:text-gold transition-colors font-light flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-[11px] text-white/50 hover:text-gold transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[11px] text-white/50 hover:text-gold transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] text-white/30 font-mono uppercase tracking-wider">
            &copy; {year} Tripzy. crafted with <span className="text-gold">passion</span> for india
          </p>
          <p className="text-[9px] text-white/20 font-mono flex items-center gap-1">
            made with <Heart className="w-3 h-3 text-gold" /> in india
          </p>
        </div>
      </div>
    </footer>
  );
}
