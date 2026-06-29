"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Compass, BookOpen, Award, MapPin } from 'lucide-react';

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(Math.floor(start));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-display text-4xl text-gold font-light block leading-none">{display}{suffix}</span>
      <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-1">{label}</span>
    </div>
  );
}

export default function AtlasPassportPreview({
  onGoToExplore,
  onGoToPassport,
}: {
  onGoToExplore?: () => void;
  onGoToPassport?: () => void;
}) {
  return (
    <section className="py-16 md:py-20 border-y border-border/30 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Atlas Stats */}
          <motion.div
            className="relative p-8 rounded-3xl bg-sand/80 border border-border/30 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold font-bold">the atlas</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <AnimatedStat value={12} label="chapters" />
              <AnimatedStat value={5} label="explorers" suffix="K+" />
              <AnimatedStat value={100} label="local secrets" suffix="+" />
            </div>
            <p className="text-xs text-muted/80 font-light leading-relaxed font-sans mb-6">
              Every destination in India is a living chapter. Explore curated stories, local secrets, and photography guides across the atlas.
            </p>
            <motion.button
              onClick={onGoToExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-night text-white text-[9px] font-bold uppercase tracking-[0.18em] hover:bg-night/80 transition-all cursor-pointer border-none"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Compass className="w-3.5 h-3.5 text-gold" />
              Explore Atlas
            </motion.button>
          </motion.div>

          {/* Passport Preview */}
          <motion.div
            className="relative p-8 rounded-3xl bg-white border border-border/30 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-teal" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-teal font-bold">your passport</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: 12, label: 'stories collected' },
                { value: 7, label: 'journeys saved' },
              ].map((stat) => {
                const StatIcon = stat.label.includes('stories') ? BookOpen : MapPin;
                return (
                  <div key={stat.label} className="text-center p-4 rounded-2xl bg-sand/60 border border-border/20">
                    <StatIcon className="w-4 h-4 text-gold/60 mx-auto mb-2" />
                    <AnimatedStat value={stat.value} label={stat.label} />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted/80 font-light leading-relaxed font-sans mb-6">
              Your personal travel journal. Collect chapters, save stories, and track your journey across India.
            </p>
            <motion.button
              onClick={onGoToPassport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-night text-night text-[9px] font-bold uppercase tracking-[0.18em] hover:bg-night hover:text-white transition-all cursor-pointer bg-transparent"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              View Passport
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
