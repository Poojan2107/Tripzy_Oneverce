"use client";
import { motion } from 'framer-motion';
import { Compass, BookOpen, MapPin, Sparkles, Award } from 'lucide-react';

export default function AtlasPassportPreview() {
  return (
    <section className="py-12 md:py-16 border-y border-warm-gray/30 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Atlas Stats */}
          <motion.div
            className="relative p-8 rounded-3xl bg-[#F8F4EE]/80 border border-warm-gray/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Compass className="w-5 h-5 text-gold" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold font-bold">the atlas</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: '87', label: 'destinations' },
                { value: '250', label: 'chapters' },
                { value: '15K', label: 'explorers' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-display text-3xl text-gold font-light block leading-none">{stat.value}</span>
                  <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted/80 font-light leading-relaxed font-sans mb-6">
              Every destination in India is a living chapter. Explore curated stories, local secrets, and photography guides across the atlas.
            </p>
            <motion.a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-night text-white text-[9px] font-bold uppercase tracking-[0.18em] hover:bg-night/80 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Compass className="w-3.5 h-3.5 text-gold" />
              Explore Atlas
            </motion.a>
          </motion.div>

          {/* Passport Preview */}
          <motion.div
            className="relative p-8 rounded-3xl bg-white border border-warm-gray/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold font-bold">your passport</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: '12', label: 'stories collected' },
                { value: '7', label: 'journeys saved' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-2xl bg-[#F8F4EE]/60 border border-warm-gray/20">
                  <span className="font-display text-2xl text-night font-light block leading-none">{stat.value}</span>
                  <span className="text-[7px] font-mono uppercase tracking-widest text-muted/70 block mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted/80 font-light leading-relaxed font-sans mb-6">
              Your personal travel journal. Collect chapters, save stories, and track your journey across India.
            </p>
            <motion.a
              href="/trips"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-night text-night text-[9px] font-bold uppercase tracking-[0.18em] hover:bg-night hover:text-white transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              View Passport
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
