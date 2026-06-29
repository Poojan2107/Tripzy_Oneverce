"use client";
import { motion } from 'framer-motion';
import { Sparkles, MapPin, BookOpen, Heart } from 'lucide-react';

const items = [
  { icon: Sparkles, color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/15', label: 'AI Itineraries', desc: 'Personalized travel guides for you' },
  { icon: MapPin, color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/15', label: 'Curated Experiences', desc: 'Handpicked secrets by locals' },
  { icon: BookOpen, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/15', label: 'Real Stories', desc: 'Authentic reviews from travelers' },
  { icon: Heart, color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/15', label: 'Save Journeys', desc: 'Archive memories in your Passport' },
];

export default function StatusCapsule() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 -mt-6 mb-16 relative z-20">
      <motion.div
        className="bg-white/75 backdrop-blur-xl rounded-3xl p-4 shadow-glass border border-border/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-3.5 text-left p-3.5 rounded-2xl border border-transparent cursor-default group"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ backgroundColor: 'rgba(245, 240, 235, 0.5)', borderColor: 'rgba(226, 220, 211, 0.4)' }}
            >
              <motion.div
                className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 border ${item.border}`}
                whileHover={{ scale: 1.12, rotate: [0, -8, 8, 0] }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-micro uppercase tracking-wider text-night">{item.label}</h4>
                <p className="text-micro text-muted/70 leading-tight">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
