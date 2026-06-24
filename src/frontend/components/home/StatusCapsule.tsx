"use client";
import { motion } from 'framer-motion';
import { Sparkles, MapPin, BookOpen, Heart } from 'lucide-react';

const items = [
  { icon: Sparkles, color: 'text-ocean', bg: 'bg-ocean/10', label: 'AI-Powered Itineraries', desc: 'Personalized travel guides for you' },
  { icon: MapPin, color: 'text-coral', bg: 'bg-coral/10', label: 'Curated Experiences', desc: 'Handpicked secrets by locals' },
  { icon: BookOpen, color: 'text-gold', bg: 'bg-gold/10', label: 'Real Stories', desc: 'Authentic reviews from travelers' },
  { icon: Heart, color: 'text-sky', bg: 'bg-sky/10', label: 'Save & Share Journeys', desc: 'Archive memories in your Passport' },
];

export default function StatusCapsule() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 -mt-4 mb-12 relative z-20">
      <motion.div
        className="bg-white/70 backdrop-blur-xl rounded-[28px] p-4 shadow-glass border border-warm-gray/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
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
              className="flex items-center gap-4 text-left p-4 rounded-2xl border border-transparent cursor-default"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ backgroundColor: 'rgba(245, 240, 235, 0.4)', borderColor: 'rgba(226, 220, 211, 0.35)' }}
            >
              <motion.div
                className={`w-11 h-11 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon className={`w-4.5 h-4.5 ${item.color}`} />
              </motion.div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-ocean transition-colors">{item.label}</h4>
                <p className="text-[10px] text-[#475569] leading-tight">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
