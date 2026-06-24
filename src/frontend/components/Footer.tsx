"use client";
import { motion } from 'framer-motion';
import { Compass, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.04 } }
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night border-t border-warm-gray/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          
          <motion.div variants={fadeUp} className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                <Compass className="w-2.5 h-2.5 text-gold" />
              </div>
              <span className="font-display text-sm font-light text-white lowercase tracking-tight">tripzy</span>
            </div>
            <p className="text-[9px] text-white/40 font-light leading-relaxed max-w-[200px]">
              AI-powered travel companion for exploring India through handcrafted chapters and curated experiences.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[7px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-1">Navigate</h4>
            <ul className="space-y-0.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Explore', href: '#explore' },
                { label: 'AI Planner', href: '#ai-planner' },
                { label: 'Discover', href: '#saved' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[9px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[7px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-1">Destinations</h4>
            <ul className="space-y-0.5">
              {[
                'Varanasi', 'Kerala', 'Ladakh', 'Udaipur', 'Jaisalmer', 'Goa',
              ].map((dest) => (
                <li key={dest}>
                  <Link
                    href={`#explore`}
                    className="text-[9px] text-white/50 hover:text-gold transition-colors font-light"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="col-span-2 sm:col-span-1">
            <h4 className="text-[7px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-1">Connect</h4>
            <ul className="space-y-0.5">
              <li>
                <a href="/contact" className="text-[9px] text-white/50 hover:text-gold transition-colors font-light flex items-center gap-2">
                  <Mail className="w-2.5 h-2.5" />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-[9px] text-white/50 hover:text-gold transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[9px] text-white/50 hover:text-gold transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

        </motion.div>

        <motion.div className="mt-2 sm:mt-3 pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }}>
          <p className="text-[7px] text-white/30 font-mono uppercase tracking-wider">
            &copy; {year} Tripzy. crafted with <span className="text-gold">passion</span> for india
          </p>
          <p className="text-[7px] text-white/20 font-mono flex items-center gap-1">
            made with <Heart className="w-2 h-2 text-gold" /> in india
          </p>
        </motion.div>
      </div>
    </footer>
  );
}