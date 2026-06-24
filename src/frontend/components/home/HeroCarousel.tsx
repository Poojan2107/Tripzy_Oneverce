"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation, PanInfo } from 'framer-motion';
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

function CarouselCard({
  slide,
  isActive,
  position,
  onClick,
  onNavigate,
}: {
  slide: CarouselSlide;
  isActive: boolean;
  position: 'left' | 'center' | 'right' | 'hidden';
  onClick: () => void;
  onNavigate: (dir: 'prev' | 'next') => void;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 120, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 120, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [isActive, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  const variants = {
    left: { x: '-35%', y: 0, z: -100, rotateY: 18, scale: 0.80, opacity: 0.45, zIndex: 10 },
    center: { x: '0%', y: 0, z: 20, rotateY: 0, scale: 1.08, opacity: 1, zIndex: 30 },
    right: { x: '35%', y: 0, z: -100, rotateY: -18, scale: 0.80, opacity: 0.45, zIndex: 10 },
    hidden: { x: '0%', y: 0, z: -200, rotateY: 0, scale: 0.7, opacity: 0, zIndex: 0 },
  };

  const springConfig = { type: "spring" as const, stiffness: 260, damping: 28, mass: 1 };

  return (
    <motion.div
      className="absolute w-[320px] h-[440px] rounded-3xl overflow-hidden cursor-pointer origin-center border border-border"
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
          boxShadow: isActive ? '0 20px 60px rgba(0, 0, 0, 0.12)' : '0 12px 40px rgba(0, 0, 0, 0.08)',
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

export default function HeroCarousel({ tours, onGoToPlanner, onGoToExplore, onSelectTour }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

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

  const staggerVariants = {
    hidden: { opacity: 1 },
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  } as const;

  return (
    <section className="relative w-full overflow-hidden bg-sand pt-24 md:pt-32 pb-16 paper-grain">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex-1 space-y-8 text-left relative z-10 w-full lg:max-w-[48%]" variants={itemVariants}>
          <div className="space-y-5">
            <motion.span
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block font-bold"
                variants={itemVariants}
            >
              tripzy · atlas vivant
            </motion.span>
            <motion.div className="relative inline-block" variants={itemVariants}>
              <h1 className="font-display text-5xl sm:text-7xl text-night font-light leading-[1.05] tracking-tight lowercase">
                explore india as<br />living <em className="italic font-light text-gold font-normal">chapters</em>
              </h1>
              <motion.div
                className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block opacity-65 text-coral"
                animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M10 20C22 14 36 16 46 26M46 26L38 24M46 26L44 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.div>
            </motion.div>
            <motion.p className="text-sm md:text-base text-muted max-w-md font-sans font-light leading-relaxed" variants={itemVariants}>Every destination tells a story. Explore chapter by chapter, journey by journey.</motion.p>
          </div>
          <motion.div className="flex flex-wrap items-center gap-4 pt-4" variants={itemVariants}>
            <motion.button
              onClick={onGoToPlanner}
              className="px-8 py-4 rounded-full bg-ocean hover:bg-ocean/90 text-white text-[11px] font-bold uppercase tracking-[0.16em] flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              Plan Your Journey
            </motion.button>
            <motion.button
              onClick={onGoToExplore}
              className="px-6 py-4 rounded-full border border-border hover:border-night text-night text-[11px] font-bold uppercase tracking-[0.16em] flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-coral"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Watch Story
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div className="flex-grow w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-[500px]" variants={itemVariants}>
          {/* Floating Passport Badge overlay */}
          <motion.div
            className="absolute top-0 right-4 z-40 flex items-center gap-3 bg-surface/95 backdrop-blur-md border border-border/80 rounded-2xl px-4 py-3 shadow-card select-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted block">Level</span>
              <span className="text-base font-display text-night font-semibold leading-none">Lv.3</span>
            </div>
            <div className="w-px h-8 bg-border/80" />
            <div className="flex gap-3">
              {[
                { value: '4', label: 'Countries' },
                { value: '6', label: 'Stories' },
                { value: '12', label: 'Chapters' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-sm font-bold text-night leading-none block">{s.value}</span>
                  <span className="text-[7px] font-mono uppercase tracking-wider text-muted/60">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

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

          {/* Active Card Metadata Row */}
          <motion.div
            key={`meta-${activeIndex}`}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted font-sans tracking-wide mt-2 mb-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-semibold text-night">{activeSlide.duration}</span>
            <span className="text-border/60">•</span>
            <span>{activeSlide.season}</span>
            <span className="text-border/60">•</span>
            <span className="text-coral font-medium">{activeSlide.matchScore}% Match</span>
            <span className="text-border/60">•</span>
            <span className="px-2 py-0.5 rounded-full bg-cream text-[9px] uppercase font-bold text-teal tracking-wider">{activeSlide.style}</span>
          </motion.div>

          {/* Carousel Navigation Controls */}
          <motion.div className="flex gap-4 items-center z-10">
            <motion.button
              onClick={() => goTo('prev')}
              className="w-10 h-10 rounded-full border border-border bg-surface/85 text-night/70 flex items-center justify-center shadow-sm cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.span
              className="font-mono text-[10px] text-muted tracking-widest"
              key={activeIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {String(activeIndex + 1).padStart(2, '0')} / {String(HERO_CAROUSEL_ITEMS.length).padStart(2, '0')}
            </motion.span>
            <motion.button
              onClick={() => goTo('next')}
              className="w-10 h-10 rounded-full border border-border bg-surface/85 text-night/70 flex items-center justify-center shadow-sm cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
