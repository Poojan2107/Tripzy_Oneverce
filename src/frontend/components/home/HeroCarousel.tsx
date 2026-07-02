"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, PanInfo, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Camera, Clock, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_CAROUSEL_ITEMS } from './data';
import { Tour } from '../../types';

interface HeroCarouselProps {
  tours: Tour[];
  onGoToPlanner: () => void;
  onGoToExplore: () => void;
  onSelectTour: (tour: Tour) => void;
}

function getMoodLabel(id: string): string {
  if (id === 'varanasi-spiritual') return 'Spiritual Chapter';
  if (['udaipur-mewar', 'jaisalmer-fort', 'hampi-ruins'].includes(id)) return 'Heritage Story';
  if (['kerala-houseboats', 'andaman-reefs', 'goa-beach'].includes(id)) return 'Coastal Escape';
  return 'Hidden Gem';
}

interface CarouselSlide { id: string; title: string; subtitle: string; category: string; badgeColor: string; tag: string; storyHook: string; bannerImage: string; explorers: string; rating: number; duration: string; season: string; matchScore: number; style: string; }

const TAG_GRADIENTS: Record<string, string> = {
  Nature: 'from-emerald-900/70 via-emerald-800/40 to-transparent',
  Luxury: 'from-teal-900/70 via-teal-800/40 to-transparent',
  Culture: 'from-amber-900/70 via-amber-800/40 to-transparent',
  Adventure: 'from-rose-900/70 via-rose-800/40 to-transparent',
  Heritage: 'from-amber-900/70 via-amber-800/40 to-transparent',
  Royal: 'from-violet-900/70 via-violet-800/40 to-transparent',
};

const TAG_ACCENTS: Record<string, string> = {
  Nature: 'rgba(16,185,129,0.15)',
  Luxury: 'rgba(13,148,136,0.15)',
  Culture: 'rgba(217,119,6,0.15)',
  Adventure: 'rgba(225,29,72,0.15)',
  Heritage: 'rgba(217,119,6,0.15)',
  Royal: 'rgba(124,58,237,0.15)',
};

function CarouselCard({
  slide, isActive, position, onClick, onNavigate,
}: {
  slide: CarouselSlide;
  isActive: boolean;
  position: 'left' | 'center' | 'right' | 'hidden';
  onClick: () => void;
  onNavigate: (dir: 'prev' | 'next') => void;
}) {
  const accentColor = TAG_ACCENTS[slide.tag] || TAG_ACCENTS.Nature;

  const variants = {
    left: { 
      x: '-42%', 
      y: 0, 
      rotate: -5,
      scale: 0.84, 
      opacity: 0.55, 
      zIndex: 10, 
      borderColor: 'rgba(255,255,255,0.1)', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)' 
    },
    center: { 
      x: '0%', 
      y: 0, 
      rotate: 0,
      scale: 1.08, 
      opacity: 1, 
      zIndex: 30, 
      borderColor: 'rgba(244,182,61,0.45)', 
      boxShadow: '0 24px 64px rgba(0,0,0,0.35)' 
    },
    right: { 
      x: '42%', 
      y: 0, 
      rotate: 5,
      scale: 0.84, 
      opacity: 0.55, 
      zIndex: 10, 
      borderColor: 'rgba(255,255,255,0.1)', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)' 
    },
    hidden: { 
      x: '0%', 
      y: 0, 
      rotate: 0,
      scale: 0.7, 
      opacity: 0, 
      zIndex: 0, 
      borderColor: 'rgba(255,255,255,0)', 
      boxShadow: 'none' 
    },
  };

  const transitionConfig = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 };

  return (
    <motion.div
      className="absolute w-[min(320px,80vw)] h-[430px] rounded-xl overflow-hidden cursor-pointer origin-center border"
      variants={variants}
      animate={position}
      transition={transitionConfig}
      whileHover={
        isActive
          ? { 
              scale: 1.12, 
              y: -10, 
              borderColor: 'rgba(244,182,61,0.85)', 
              boxShadow: '0 32px 72px rgba(0,0,0,0.45), 0 0 20px rgba(244,182,61,0.35)' 
            }
          : { 
              scale: 0.88, 
              opacity: 0.75 
            }
      }
      whileTap={isActive ? { scale: 1.08 } : undefined}
      style={{
        pointerEvents: position === 'hidden' ? 'none' : 'auto',
      }}
      onClick={isActive ? onClick : () => position === 'left' ? onNavigate('next') : onNavigate('prev')}
    >
      <div className="w-full h-full flex flex-col relative bg-surface/85 backdrop-blur-md">
          <div className="h-[58%] w-full overflow-hidden relative bg-secondary-surface">
            <Image
              src={slide.bannerImage}
              alt={slide.title}
              fill
              className={`object-cover transition-transform duration-700 ${isActive ? 'scale-[1.04]' : 'scale-100'}`}
              sizes="320px"
              priority={isActive}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <span className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-sm text-meta font-mono font-bold text-white uppercase border border-white/25 backdrop-blur-md shadow-sm tracking-wide ${slide.badgeColor}`}>{slide.category}</span>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <span className="text-meta font-mono text-white/95 font-bold tracking-wider drop-shadow-sm">{slide.subtitle}</span>
            </div>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-between text-left bg-surface/95 paper-grain border-t border-border/40">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-card text-night font-light lowercase leading-tight">{slide.title}</h3>
                <motion.div
                  className="flex items-center gap-1"
                  animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.6, delay: 2 }}
                >
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span className="text-meta font-bold text-night mt-0.5">{slide.rating}</span>
                </motion.div>
              </div>
              <p className="text-body text-muted/80 leading-relaxed font-sans font-light line-clamp-3">{slide.storyHook}</p>
            </div>
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-meta font-mono text-muted">
                <Users className="w-3.5 h-3.5 text-teal" />
                <span>{slide.explorers} explorers loved this</span>
              </div>
              {isActive && (
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="btn-night h-8.5 min-h-[34px] px-3.5 rounded-md text-meta font-bold uppercase flex items-center gap-1 cursor-pointer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Chapter <ArrowRight className="w-3 h-3 text-gold" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
  );
}

const AMBIENT_PARTICLES = [
  { x: '8%', y: '15%', size: 120, color: 'rgba(244,182,61,0.10)', duration: 8 },
  { x: '92%', y: '12%', size: 160, color: 'rgba(233,92,116,0.07)', duration: 10 },
  { x: '3%', y: '75%', size: 80, color: 'rgba(24,182,201,0.09)', duration: 7 },
  { x: '95%', y: '85%', size: 130, color: 'rgba(244,182,61,0.06)', duration: 9 },
  { x: '50%', y: '5%', size: 60, color: 'rgba(233,92,116,0.05)', duration: 6 },
  { x: '25%', y: '90%', size: 90, color: 'rgba(244,182,61,0.05)', duration: 11 },
];

function FloatingParticles() {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
      {AMBIENT_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function HeroCarousel({ tours, onGoToPlanner, onGoToExplore, onSelectTour }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const progressRef = useRef<ReturnType<typeof setInterval>>(null);

  const activeSlide = HERO_CAROUSEL_ITEMS[activeIndex];

  const handleSelectActiveTour = () => {
    const matched = tours.find(t => t.id === activeSlide.id);
    matched ? onSelectTour(matched) : onGoToExplore();
  };

  const goTo = useCallback((dir: 'prev' | 'next') => {
    setActiveIndex(prev => {
      const total = HERO_CAROUSEL_ITEMS.length;
      return dir === 'next' ? (prev + 1) % total : (prev - 1 + total) % total;
    });
    setProgress(0);
  }, []);

  const getPosition = (index: number): 'left' | 'center' | 'right' | 'hidden' => {
    const total = HERO_CAROUSEL_ITEMS.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === total - 1) return 'left';
    return 'hidden';
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) goTo('next');
    else if (info.offset.x > 50) goTo('prev');
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => goTo('next'), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goTo]);

  useEffect(() => {
    progressRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [activeIndex]);

  const staggerVariants = {
    hidden: { opacity: 1 },
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  } as const;

  const gradientClass = TAG_GRADIENTS[activeSlide.tag] || TAG_GRADIENTS.Nature;

  return (
    <section className="relative w-full h-[95vh] min-h-[680px] flex flex-col overflow-hidden bg-night">
      {/* Full-bleed background per slide — crossfade without remount */}
      <div className="absolute inset-0">
        {HERO_CAROUSEL_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === activeIndex ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Image
              src={item.bannerImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0 || i === activeIndex}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${TAG_GRADIENTS[item.tag] || TAG_GRADIENTS.Nature}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-night/30" />
          </motion.div>
        ))}
      </div>

      {/* Top scrim gradient for navbar text contrast */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

      {/* Bottom gradient strip — seamless handoff to next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F8F4EE] to-transparent pointer-events-none z-10" />

      {/* Vignette overlay */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.4)] pointer-events-none" />

      {/* Ambient floating particles */}
      <FloatingParticles />

      {/* Paper grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full flex-grow flex flex-col justify-center pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
        <motion.div
          className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: Editorial text panel */}
            <motion.div className="flex-1 space-y-6 text-left relative z-10 w-full lg:max-w-[42%]" variants={itemVariants}>
              <div className="space-y-6">
                <motion.div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-sm" variants={itemVariants}>
                  <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_rgba(244,182,61,0.9)] animate-pulse" />
                  <span className="text-meta font-mono text-white/90 tracking-wider uppercase">travebie · atlas vivant</span>
                </motion.div>
 
                <motion.div className="relative inline-block" variants={itemVariants}>
                  <h1 className="font-display text-display text-white leading-[0.92] tracking-tight lowercase drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
                    explore india<br />as living<br /><em className="italic font-light text-gold font-normal">chapters</em>
                  </h1>
                  <motion.div
                    className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:block opacity-40"
                    animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="50" height="50" viewBox="0 0 60 60" fill="none"><path d="M10 20C22 14 36 16 46 26M46 26L38 24M46 26L44 34" stroke="#F4B63D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </motion.div>
                </motion.div>
 
                <motion.p className="text-body text-white/70 max-w-md font-light leading-relaxed" variants={itemVariants}>
                  Every destination tells a story. Explore chapter by chapter, journey by journey.
                </motion.p>
              </div>
 
              <motion.div className="flex flex-wrap items-center gap-4 pt-2" variants={itemVariants}>
                <motion.button
                  onClick={onGoToPlanner}
                  className="btn btn-primary h-12 px-7 rounded-md text-caption tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(244,182,61,0.45),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_36px_rgba(244,182,61,0.65)] transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Sparkles className="w-4 h-4" />
                  Plan Your Journey
                </motion.button>
                <motion.button
                  onClick={onGoToExplore}
                  className="btn btn-outline border-white/25 hover:border-white/60 text-white/85 hover:text-white h-12 px-5 rounded-md text-caption bg-white/8 backdrop-blur-sm flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-white/15"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-gold"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Explore Chapters
                </motion.button>
              </motion.div>
 
              {/* Slide-specific metadata inline */}
              <motion.div key={`meta-${activeIndex}`}
                className="flex flex-wrap items-center gap-4 text-caption text-white/60 pt-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-semibold text-white/90">{activeSlide.duration}</span>
                <span className="text-white/20">•</span>
                <span className="text-white/65">{activeSlide.season}</span>
                <span className="text-white/20">•</span>
                <span className="text-gold font-semibold">{getMoodLabel(activeSlide.id)}</span>
                <span className="text-white/20">•</span>
                <span className="px-2 py-0.5 rounded-sm bg-white/[0.12] border border-white/10 text-meta text-gold font-bold">{activeSlide.style}</span>
              </motion.div>
            </motion.div>
 
            {/* Right: Carousel area */}
            <motion.div className="flex-grow w-full lg:w-1/2 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]" variants={itemVariants}>
              {/* Floating Passport Badge — desktop only */}
              <motion.div
                className="absolute top-0 right-2 lg:right-8 z-40 hidden lg:flex flex-col items-start gap-1.5 bg-black/25 backdrop-blur-2xl border border-white/15 rounded-xl px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] select-none text-left"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_4px_rgba(244,182,61,0.9)] animate-pulse" />
                  <span className="text-caption text-gold font-bold tracking-wider uppercase">Atlas Chronicles</span>
                </div>
                <div className="flex gap-5 mt-1">
                  {[
                    { value: '12', label: 'Chapters' },
                    { value: '4', label: 'Regions' },
                    { value: '∞', label: 'Stories' },
                  ].map((s) => (
                    <div key={s.label} className="text-left">
                      <span className="text-2xl font-bold text-white block font-display leading-none tracking-tight">{s.value}</span>
                      <span className="text-meta font-mono text-white/50 block mt-0.5 uppercase tracking-wider">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Carousel Cards Container */}
              <motion.div
                className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center select-none"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
              >
                {HERO_CAROUSEL_ITEMS.map((item, idx) => (
                  <CarouselCard
                    key={item.id}
                    slide={item}
                    isActive={getPosition(idx) === 'center'}
                    position={getPosition(idx)}
                    onClick={handleSelectActiveTour}
                    onNavigate={goTo}
                  />
                ))}
              </motion.div>

              {/* Progress bar + Navigation */}
              <motion.div className="flex items-center gap-5 z-10 mt-4 w-full max-w-[380px]">
                <motion.button
                  onClick={() => goTo('prev')}
                  aria-label="Previous slide"
                  className="w-9 h-9 rounded-full btn-ghost text-white/60 flex items-center justify-center cursor-pointer shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                {/* Animated progress bar */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gold rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.05, ease: "linear" }}
                    />
                  </div>
                  <motion.span
                    className="font-mono text-micro text-white/40 tracking-widest shrink-0"
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {String(activeIndex + 1).padStart(2, '0')} / {String(HERO_CAROUSEL_ITEMS.length).padStart(2, '0')}
                  </motion.span>
                </div>

                <motion.button
                  onClick={() => goTo('next')}
                  aria-label="Next slide"
                  className="w-9 h-9 rounded-full btn-ghost text-white/60 flex items-center justify-center cursor-pointer shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
