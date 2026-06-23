"use client";
import { BookOpen, Sparkles, Compass } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function WhyTripzy() {
  return (
    <section className="py-12 md:py-16 border-y border-warm-gray/30 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: BookOpen, color: 'text-coral', bg: 'bg-coral/10', title: 'editorial chapters', desc: 'Unveil the secret corners of India through curated region-specific chapters. Not just lists, but stories that explore local culture and hidden treasures.' },
              { icon: Sparkles, color: 'text-ocean', bg: 'bg-ocean/10', title: 'ai journey generator', desc: 'Bespoke day-wise itineraries engineered to match your companion, pace, style, and budget, complete in less than 60 seconds with ₹ INR pricing.' },
              { icon: Compass, color: 'text-gold', bg: 'bg-gold/10', title: 'atlas discovery', desc: 'Interact with real coordinates, regional color maps, photography guides, and local secrets on our split-screen Explore Atlas.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="space-y-3">
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}><Icon className="w-5 h-5 stroke-[1.5]" /></div>
                  <h3 className="font-display text-2xl text-night font-light lowercase">{item.title}</h3>
                  <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
