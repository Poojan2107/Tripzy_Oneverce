"use client";
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';

interface JourneyCtaProps {
  onGoToPlanner: () => void;
  onGoToExplore: () => void;
}

function MagneticButton({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

export default function JourneyCta({ onGoToPlanner, onGoToExplore }: JourneyCtaProps) {
  return (
    <section className="py-20 md:py-28 bg-cream/30 border-t border-warm-gray/30">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 text-center">
        <motion.div
          className="relative border border-gold/30 rounded-[32px] p-8 md:p-14 bg-white/60 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ background: ['radial-gradient(circle, rgba(253,182,47,0.05) 0%, transparent 100%)', 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 100%)', 'radial-gradient(circle, rgba(253,182,47,0.05) 0%, transparent 100%)'] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative z-10">
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-coral block mb-4 font-bold"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              the voyage awaits
            </motion.span>
            <motion.h2
              className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em] leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              script your own <br />
              <span className="italic font-light text-gold font-normal">indian odyssey</span>
            </motion.h2>
            <motion.p
              className="text-xs sm:text-sm text-muted leading-relaxed font-light max-w-xl mx-auto mb-8 font-sans"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our journey builder crafts customized itineraries rooted in local secrets, signature food experiences, and real coordinates — in under a minute.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <MagneticButton onClick={onGoToPlanner} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] cursor-pointer shadow-md">
                <Sparkles className="w-4 h-4 text-gold" /> Plan Your Journey
              </MagneticButton>
              <MagneticButton onClick={onGoToExplore} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-night text-night text-[11px] font-bold uppercase tracking-[0.18em] cursor-pointer">
                <Compass className="w-4 h-4" /> Browse Atlas
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
