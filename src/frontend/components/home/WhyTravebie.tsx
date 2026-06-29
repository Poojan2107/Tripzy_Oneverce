"use client";
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Compass } from 'lucide-react';

const items = [
  { icon: BookOpen, color: 'text-coral', bg: 'bg-coral/10', title: 'editorial chapters', desc: 'Unveil the secret corners of India through curated region-specific chapters. Not just lists, but stories that explore local culture and hidden treasures.' },
  { icon: Sparkles, color: 'text-teal', bg: 'bg-teal/10', title: 'ai journey generator', desc: 'Bespoke day-wise itineraries engineered to match your companion, pace, style, and budget, complete in less than 60 seconds with ₹ INR pricing.' },
  { icon: Compass, color: 'text-gold', bg: 'bg-gold/10', title: 'atlas discovery', desc: 'Interact with real coordinates, regional color maps, photography guides, and local secrets on our split-screen Explore Atlas.' },
];

function FloatIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function Card({ item, index }: { item: typeof items[0]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-border/30 card-lift"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="relative z-10 space-y-4">
        <FloatIcon>
          <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 stroke-[1.5]" />
          </div>
        </FloatIcon>
        <h3 className="font-display text-2xl text-night font-light lowercase">{item.title}</h3>
        <p className="text-small text-muted/90 leading-relaxed font-light font-sans">{item.desc}</p>
      </div>
      <motion.div
        className="absolute -inset-[2px] rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(253,182,47,0.08), rgba(230,53,90,0.04), rgba(59,130,246,0.06))',
          filter: 'blur(8px)',
        }}
      />
    </motion.div>
  );
}

export default function WhyTravebie() {
  return (
    <section className="py-12 md:py-16 border-y border-border/30 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => <Card key={i} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}
