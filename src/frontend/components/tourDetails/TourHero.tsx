"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Heart, Share2, CheckCircle2, MapPin, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Tour } from '../../types';

const MotionImage = motion.create(Image);

function getMoodLabel(id: string): string {
  if (id === 'varanasi-spiritual') return 'Spiritual Chapter';
  if (['udaipur-mewar', 'jaisalmer-fort', 'hampi-ruins'].includes(id)) return 'Heritage Story';
  if (['kerala-houseboats', 'andaman-reefs', 'goa-beach'].includes(id)) return 'Coastal Escape';
  return 'Hidden Gem';
}

interface TourHeroProps {
  tour: Tour;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  tagline?: string;
  copiedLink: boolean;
  onShare: () => void;
}

export default function TourHero({ tour, onBack, onToggleWishlist, isWishlisted, tagline, copiedLink, onShare }: TourHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div ref={heroRef} className="relative w-full h-[45vh] md:h-[60vh] min-h-[300px] md:min-h-[440px] overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ opacity }}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-secondary-surface animate-pulse flex items-center justify-center">
          <span className="text-micro font-mono text-white/30 uppercase tracking-widest">Loading panorama...</span>
        </div>
      )}
      <div className="absolute inset-0">
        <MotionImage src={tour.bannerImage} alt={tour.title} fill className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)}
          style={{ y: parallaxY }} priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

      <motion.button onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-3 rounded-full btn-ghost text-white text-small font-bold uppercase tracking-widest cursor-pointer z-20 min-h-[44px]"
        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, type: "spring", stiffness: 100, damping: 20 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </motion.button>

      <motion.div className="absolute top-6 right-6 flex items-center gap-2 z-20"
        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}>
        <motion.button onClick={onShare} className="w-11 h-11 rounded-full btn-ghost flex items-center justify-center text-white cursor-pointer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
        </motion.button>
        <motion.button onClick={() => onToggleWishlist(tour.id)} className="w-11 h-11 rounded-full btn-ghost flex items-center justify-center text-white cursor-pointer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
        </motion.button>
      </motion.div>

      <motion.div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }} style={{ opacity: contentOpacity }}>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {tour.chapterName && (
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-micro font-mono text-white/70 uppercase tracking-widest">{tour.chapterName}</span>
          )}
          <span className="px-3 py-1 rounded-full bg-gold/90 text-micro font-bold text-white uppercase tracking-wider">{getMoodLabel(tour.id)}</span>
          {tour.moods?.slice(0, 2).map(m => (
            <span key={m} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-micro font-medium text-white uppercase tracking-wider">{m}</span>
          ))}
        </div>
        <h1 className="font-display text-white lowercase font-light tracking-[-0.03em] leading-none" style={{ fontSize: 'clamp(44px, 7vw, 96px)', lineHeight: '0.88' }}>
          {tour.title}
        </h1>
        {tagline && <p className="text-sm text-white/60 font-light mt-3 italic max-w-md">{tagline}</p>}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-small font-mono text-white/60 uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-gold" /> {tour.location}
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-small font-mono text-white/60 uppercase tracking-widest">{tour.duration}</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="flex items-center gap-1 text-small font-mono text-white/60">
            <Star className="w-3 h-3 fill-gold text-gold" />{tour.rating?.toFixed(1)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
