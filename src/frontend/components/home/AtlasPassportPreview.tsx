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
      <span className="font-display text-heading text-gold font-light block leading-none">{display}{suffix}</span>
      <span className="text-meta font-mono text-muted/70 block mt-1">{label}</span>
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
    <section className="py-16 md:py-24 border-t border-border/20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Atlas Stats */}
          <motion.div
            className="relative p-8 rounded-lg bg-background/80 border border-border/25 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gold" />
              </div>
              <span className="text-meta font-mono text-gold">the atlas</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <AnimatedStat value={12} label="chapters" />
              <AnimatedStat value={5} label="explorers" suffix="K+" />
              <AnimatedStat value={100} label="local secrets" suffix="+" />
            </div>
            <p className="text-body text-muted/80 font-light leading-relaxed mb-6">
              Every destination in India is a living chapter. Explore curated stories, local secrets, and photography guides across the atlas.
            </p>
            <motion.button
              onClick={onGoToExplore}
              className="btn btn-night h-10 px-5 rounded-md text-caption flex items-center gap-2 cursor-pointer shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Compass className="w-3.5 h-3.5 text-gold" />
              Explore Atlas
            </motion.button>
          </motion.div>
 
          {/* Passport Preview */}
          <motion.div
            className="relative p-8 rounded-lg bg-white border border-border/25 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-md bg-teal/10 border border-teal/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-teal" />
              </div>
              <span className="text-meta font-mono text-teal">your passport</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: 12, label: 'stories collected' },
                { value: 7, label: 'journeys saved' },
              ].map((stat) => {
                const StatIcon = stat.label.includes('stories') ? BookOpen : MapPin;
                return (
                  <div key={stat.label} className="text-center p-4 rounded-md bg-background/60 border border-border/20">
                    <StatIcon className="w-4 h-4 text-gold/60 mx-auto mb-2" />
                    <AnimatedStat value={stat.value} label={stat.label} />
                  </div>
                );
              })}
            </div>
            <p className="text-body text-muted/80 font-light leading-relaxed mb-6">
              Your personal travel journal. Collect chapters, save stories, and track your journey across India.
            </p>
            <motion.button
              onClick={onGoToPassport}
              className="btn btn-outline border-night text-night hover:bg-night hover:text-white h-10 px-5 rounded-md text-caption flex items-center gap-2 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
