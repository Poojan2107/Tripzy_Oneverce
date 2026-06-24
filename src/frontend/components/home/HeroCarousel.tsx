"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Camera, Clock, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_CAROUSEL_ITEMS } from './data';
import { Tour } from '../../types';

interface HeroCarouselProps {
  tours: Tour[];
  onGoToPlanner: () => void;
  onGoToExplore: () => void;
  onSelectTour: (tour: Tour) => void;
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
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [5, -5]), { stiffness: 120, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-5, 5]), { stiffness: 120, damping: 30 });
  const accentColor = TAG_ACCENTS[slide.tag] || TAG_ACCENTS.Nature;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [isActive, x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0.5); y.set(0.5); }, [x, y]);

  const variants = {
    left: { x: '-35%', y: 0, z: -100, rotateY: 18, scale: 0.80, opacity: 0.45, zIndex: 10 },
    center: { x: '0%', y: 0, z: 20, rotateY: 0, scale: 1.08, opacity: 1, zIndex: 30 },
    right: { x: '35%', y: 0, z: -100, rotateY: -18, scale: 0.80, opacity: 0.45, zIndex: 10 },
    hidden: { x: '0%', y: 0, z: -200, rotateY: 0, scale: 0.7, opacity: 0, zIndex: 0 },
  };

  const springConfig = { type: "spring" as const, stiffness: 260, damping: 28, mass: 1 };

  return (
    <motion.div
      className="absolute w-[320px] h-[440px] rounded-3xl overflow-hidden cursor-pointer origin-center border border-white/20"
      variants={variants}
      animate={position}
      transition={springConfig}
      style={{
        perspective: 1200,
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
        pointerEvents: position === 'hidden' ? 'none' : 'auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isActive ? onClick : () => position === 'left' ? onNavigate('next') : onNavigate('prev')}
      whileTap={isActive ? { scale: 0.98 } : undefined}
    >
      <motion.div
        className="w-full h-full rounded-3xl overflow-hidden"
        style={{
          boxShadow: isActive
            ? `0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px ${accentColor}`
            : '0 12px 40px rgba(0,0,0,0.08)',
        }}
      >
        <div className="w-full h-full flex flex-col relative bg-surface">
          <div className="h-[55%] w-full overflow-hidden relative bg-secondary-surface">
            <motion.img
              src={slide.bannerImage}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{ scale: isActive ? 1.05 : 1 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-bold text-white uppercase tracking-wider ${slide.badgeColor}`}>{slide.category}</span>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/95">{slide.subtitle}</span>
            </div>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-between text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2.5xl text-night font-light lowercase leading-tight">{slide.title}</h3>
                <motion.div
                  className="flex items-center gap-1"
                  animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.6, delay: 2 }}
                >
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span className="text-[10px] font-bold text-night mt-0.5">{slide.rating}</span>
                </motion.div>
              </div>
              <p className="text-xs text-muted/80 leading-relaxed font-sans font-light line-clamp-3">{slide.storyHook}</p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted">
                <Users className="w-3.5 h-3.5 text-ocean" />
                <span>{slide.explorers} explorers loved this</span>
              </div>
              {isActive && (
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="px-3.5 py-2 rounded-xl bg-night hover:bg-ocean text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Chapter <ArrowRight className="w-3 h-3 text-gold" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const AMBIENT_PARTICLES = [
  { x: '8%', y: '15%', size: 80, color: 'rgba(244,182,61,0.08)', duration: 8 },
  { x: '92%', y: '12%', size: 120, color: 'rgba(233,92,116,0.06)', duration: 10 },
  { x: '3%', y: '75%', size: 60, color: 'rgba(24,182,201,0.07)', duration: 7 },
  { x: '95%', y: '85%', size: 100, color: 'rgba(244,182,61,0.05)', duration: 9 },
  { x: '50%', y: '5%', size: 40, color: 'rgba(233,92,116,0.04)', duration: 6 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
    return () => clearInterval(intervalRef.current);
  }, [goTo]);

  useEffect(() => {
    progressRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 50);
    return () => clearInterval(progressRef.current);
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
    <section className="relative w-full min-h-screen overflow-hidden bg-night">
      {/* Full-bleed background per slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${activeIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <img
            src={activeSlide.bannerImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-night/30" />
        </motion.div>
      </AnimatePresence>

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

      <div className="relative z-10 min-h-screen flex flex-col justify-center">
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
                <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10" variants={itemVariants}>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">tripzy · atlas vivant</span>
                </motion.div>

                <motion.div className="relative inline-block" variants={itemVariants}>
                  <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white font-light leading-[0.95] tracking-tight lowercase">
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

                <motion.p className="text-sm md:text-base text-white/60 max-w-md font-sans font-light leading-relaxed" variants={itemVariants}>
                  Every destination tells a story. Explore chapter by chapter, journey by journey.
                </motion.p>
              </div>

              <motion.div className="flex flex-wrap items-center gap-4 pt-2" variants={itemVariants}>
                <motion.button
                  onClick={onGoToPlanner}
                  className="px-8 py-4 rounded-full bg-gold hover:bg-gold/90 text-night text-[11px] font-bold uppercase tracking-[0.16em] flex items-center gap-2 cursor-pointer shadow-lg shadow-gold/20"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Sparkles className="w-4 h-4" />
                  Plan Your Journey
                </motion.button>
                <motion.button
                  onClick={onGoToExplore}
                  className="px-6 py-4 rounded-full border border-white/20 hover:border-white/60 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-[0.16em] flex items-center gap-2 cursor-pointer backdrop-blur-sm bg-white/5"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-gold"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Watch Story
                </motion.button>
              </motion.div>

              {/* Slide-specific metadata inline */}
              <motion.div key={`meta-${activeIndex}`}
                className="flex flex-wrap items-center gap-4 text-xs text-white/50 font-sans tracking-wide pt-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-semibold text-white/80">{activeSlide.duration}</span>
                <span className="text-white/20">•</span>
                <span>{activeSlide.season}</span>
                <span className="text-white/20">•</span>
                <span className="text-gold font-medium">{activeSlide.matchScore}% Match</span>
                <span className="text-white/20">•</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] uppercase font-bold tracking-wider text-gold">{activeSlide.style}</span>
              </motion.div>
            </motion.div>

            {/* Right: Carousel area */}
            <motion.div className="flex-grow w-full lg:w-1/2 flex flex-col items-center justify-center relative min-h-[520px]" variants={itemVariants}>
              {/* Floating Passport Badge */}
              <motion.div
                className="absolute top-0 right-2 lg:right-8 z-40 flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl select-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-white/50 block">Level</span>
                  <span className="text-base font-display text-white font-semibold leading-none">Lv.3</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex gap-3">
                  {[
                    { value: '4', label: 'Countries' },
                    { value: '6', label: 'Stories' },
                    { value: '12', label: 'Chapters' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <span className="text-sm font-bold text-white leading-none block">{s.value}</span>
                      <span className="text-[7px] font-mono uppercase tracking-wider text-white/40">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Carousel Cards Container */}
              <motion.div
                className="relative w-full h-[480px] flex items-center justify-center select-none"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
              >
                <AnimatePresence mode="popLayout">
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
                </AnimatePresence>
              </motion.div>

              {/* Progress bar + Navigation */}
              <motion.div className="flex items-center gap-5 z-10 mt-4 w-full max-w-[380px]">
                <motion.button
                  onClick={() => goTo('prev')}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/60 flex items-center justify-center cursor-pointer backdrop-blur-sm shrink-0"
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
                    className="font-mono text-[10px] text-white/40 tracking-widest shrink-0"
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
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/60 flex items-center justify-center cursor-pointer backdrop-blur-sm shrink-0"
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
