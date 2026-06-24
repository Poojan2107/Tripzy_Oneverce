"use client";
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, User, Heart, MapPin } from 'lucide-react';

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
    <motion.button ref={ref} onClick={onClick} className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

export default function CompanionPreview() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F4EE]/50 border-t border-warm-gray/30">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 text-center">
        <motion.div
          className="relative border border-gold/30 rounded-[32px] p-8 md:p-14 bg-white/80 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <div className="relative z-10">
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-coral block mb-4 font-bold"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              travel companion
            </motion.span>
            <motion.h2
              className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.04em] leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              craft your <span className="italic font-light text-gold">next chapter</span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { icon: User, label: 'Solo Explorer', color: 'text-ocean', bg: 'bg-ocean/10' },
                { icon: Heart, label: 'Couple Escape', color: 'text-coral', bg: 'bg-coral/10' },
                { icon: Compass, label: 'Cultural', color: 'text-gold', bg: 'bg-gold/10' },
                { icon: MapPin, label: 'Adventure', color: 'text-teal', bg: 'bg-teal/10' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#F8F4EE]/60 border border-warm-gray/20">
                    <div className={`w-8 h-8 rounded-full ${item.bg} ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted/80">{item.label}</span>
                  </div>
                );
              })}
            </motion.div>

            <motion.p
              className="text-xs sm:text-sm text-muted leading-relaxed font-light max-w-xl mx-auto mb-8 font-sans"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Tell your companion about your travel style, who is joining, and your preferred pace. 
              A custom journey chapter will be crafted around your story.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MagneticButton onClick={() => {}} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] cursor-pointer shadow-md">
                <Sparkles className="w-4 h-4 text-gold" /> Craft Journey
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
