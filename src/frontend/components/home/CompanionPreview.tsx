"use client";
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, User, Heart, MapPin, MessageCircle, SendHorizonal, Loader2 } from 'lucide-react';

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

const MOCK_MESSAGES = [
  { role: 'user', text: 'Planning a solo trip to India, where should I start?' },
  { role: 'companion', text: 'Varanasi in October — monsoon clears, the ghats breathe. I will craft a 5-day spiritual immersion.' },
  { role: 'user', text: 'I love food and photography too.' },
  { role: 'companion', text: 'Added: dawn boat ride for golden hour shots + a hidden rooftop kitchen for homemade Bihari thali.' },
];

export default function CompanionPreview({ onGoToPlanner }: { onGoToPlanner?: () => void }) {
  const [visibleMessages, setVisibleMessages] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < MOCK_MESSAGES.length) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 800);
          return prev + 1;
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <section className="py-16 md:py-20 bg-white border-t border-border/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Messaging mockup */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <div className="relative border border-border/20 rounded-lg p-5 bg-white/90 backdrop-blur-sm shadow-md overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border/15">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-caption text-night block">travebie companion</span>
                  <span className="text-meta text-muted font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    Ready to craft your journey
                  </span>
                </div>
              </div>
 
              {/* Chat messages */}
              <div className="space-y-3 min-h-[220px]">
                <AnimatePresence mode="popLayout">
                  {MOCK_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-md text-left ${
                        msg.role === 'user'
                          ? 'bg-night text-white rounded-br-none shadow-sm'
                          : 'bg-secondary-surface/80 text-night rounded-bl-none border border-border/15 shadow-sm'
                      }`}>
                        <p className={`text-body leading-relaxed font-sans ${msg.role === 'user' ? 'text-white/90' : 'text-night/80'}`}>
                          {msg.role === 'companion' && (
                            <Sparkles className="w-3.5 h-3.5 text-gold inline mr-1.5" />
                          )}
                          {msg.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="px-4 py-2.5 rounded-md bg-secondary-surface/80 border border-border/15 rounded-bl-none shadow-sm">
                      <div className="flex gap-1 py-1">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-muted/40"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
 
              {/* Chat input */}
              <div className="mt-4 pt-3 border-t border-border/15 flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 rounded-md bg-secondary-surface/60 text-meta text-muted/60 text-left cursor-text border border-border/20">
                  Tell me about your dream journey...
                </div>
                <div className="w-9 h-9 rounded-md bg-gold flex items-center justify-center cursor-pointer shadow-sm">
                  <SendHorizonal className="w-4 h-4 text-night" />
                </div>
              </div>
            </div>
 
            {/* Decorative element */}
            <motion.div
              className="absolute -bottom-4 -right-4 -z-10 w-32 h-32 rounded-full bg-gold/5 blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.div>
 
          {/* Right: Content */}
          <motion.div className="order-1 lg:order-2 text-left"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <motion.span
              className="text-meta font-mono text-coral block mb-3"
            >
              travel companion
            </motion.span>
            <motion.h2
              className="font-display text-heading text-night lowercase font-light leading-[1.05] mb-4"
            >
              craft your <span className="italic font-light text-gold">next chapter</span>
            </motion.h2>
            <motion.p className="text-body text-muted/80 font-light max-w-md mb-6 leading-relaxed">
              Tell the companion about your travel style, who is joining, and your pace. A custom journey chapter will be crafted around your story.
            </motion.p>
 
            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mb-8">
              {[
                { icon: User, label: 'Solo Explorer', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/15' },
                { icon: Heart, label: 'Couple Escape', color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/15' },
                { icon: Compass, label: 'Cultural', color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/15' },
                { icon: MapPin, label: 'Adventure', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/15' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-md bg-white/70 border ${item.border} cursor-default shadow-sm`}
                    whileHover={{ y: -3, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className={`w-9 h-9 rounded-full ${item.bg} ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-meta font-mono text-muted/80">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
 
            <MagneticButton onClick={() => onGoToPlanner?.()}
              className="btn btn-night h-12 px-6 rounded-md text-caption flex items-center gap-2 cursor-pointer shadow-md">
              <Sparkles className="w-4 h-4 text-gold" /> Craft Journey
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
