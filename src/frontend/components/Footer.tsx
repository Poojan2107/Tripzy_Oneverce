import { Compass, Mail, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night border-t border-warm-gray/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-gold" />
              </div>
              <span className="font-display text-lg font-light text-white lowercase tracking-tight">tripzy</span>
            </div>
            <p className="text-[10px] text-white/40 font-light leading-relaxed max-w-[220px]">
              AI-powered travel companion for exploring India through handcrafted chapters and curated experiences.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-2">Navigate</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Explore', href: '#explore' },
                { label: 'AI Planner', href: '#ai-planner' },
                { label: 'Discover', href: '#saved' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[10px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-2">Destinations</h4>
            <ul className="space-y-1.5">
              {[
                'Varanasi', 'Kerala', 'Ladakh', 'Udaipur', 'Jaisalmer', 'Goa',
              ].map((dest) => (
                <li key={dest}>
                  <Link
                    href={`#explore`}
                    className="text-[10px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-2">Connect</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="/contact" className="text-[10px] text-white/50 hover:text-gold transition-colors font-light flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-[10px] text-white/50 hover:text-gold transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[10px] text-white/50 hover:text-gold transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[8px] text-white/30 font-mono uppercase tracking-wider">
            &copy; {year} Tripzy. crafted with <span className="text-gold">passion</span> for india
          </p>
          <p className="text-[8px] text-white/20 font-mono flex items-center gap-1">
            made with <Heart className="w-2.5 h-2.5 text-gold" /> in india
          </p>
        </div>
      </div>
    </footer>
  );
}
