"use client";
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Award, ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const steps = [
  {
    number: '01',
    title: 'Explore Chapters',
    desc: 'Discover handcrafted stories across India.',
    icon: BookOpen,
    color: 'text-teal',
    bgColor: 'bg-teal/10',
    borderColor: 'border-teal/20',
  },
  {
    number: '02',
    title: 'Craft Your Journey',
    desc: 'Let your travel companion create a personalized route.',
    icon: Sparkles,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/20',
  },
  {
    number: '03',
    title: 'Save To Passport',
    desc: 'Collect chapters and preserve your travel history.',
    icon: Award,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/20',
  },
];

export default function HowTravebieWorks() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-border/25">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <span className="text-meta font-mono text-gold block mb-3">how it works</span>
            <h2 className="font-display text-heading text-night lowercase font-light tracking-[-0.03em]">
              your explorer&rsquo;s <em className="italic font-light text-teal">journey</em>
            </h2>
          </div>
        </ScrollReveal>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 80, damping: 20 }}
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px border-t border-dashed border-border/40" />
                )}
                <div className={`w-20 h-20 rounded-lg ${step.bgColor} border ${step.borderColor} flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-105 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <span className="text-meta font-mono text-muted/40 block mb-2">{step.number}</span>
                <h3 className="font-display text-card text-night font-light lowercase mb-2">{step.title}</h3>
                <p className="text-body text-muted/60 font-light max-w-xs mx-auto leading-normal">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
 
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 text-meta font-mono text-muted/40">
            <span className="w-8 h-px bg-border/40" />
            <span>three steps to your story</span>
            <span className="w-8 h-px bg-border/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
