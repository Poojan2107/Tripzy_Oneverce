"use client";
import { useRef, useState } from 'react';
import { Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Camera, Clock, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_CAROUSEL_ITEMS } from './data';
import { Tour } from '../../types';

interface HeroCarouselProps {
  tours: Tour[];
  onGoToPlanner: () => void;
  onGoToExplore: () => void;
  onSelectTour: (tour: Tour) => void;
}

export default function HeroCarousel({ tours, onGoToPlanner, onGoToExplore, onSelectTour }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 50) handleNextSlide();
    else if (diffX < -50) handlePrevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNextSlide = () => setActiveIndex(prev => (prev + 1) % HERO_CAROUSEL_ITEMS.length);
  const handlePrevSlide = () => setActiveIndex(prev => (prev - 1 + HERO_CAROUSEL_ITEMS.length) % HERO_CAROUSEL_ITEMS.length);

  const activeSlide = HERO_CAROUSEL_ITEMS[activeIndex];
  const handleSelectActiveTour = () => {
    const matched = tours.find(t => t.id === activeSlide.id);
    matched ? onSelectTour(matched) : onGoToExplore();
  };

  const getCardClass = (index: number) => {
    const total = HERO_CAROUSEL_ITEMS.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return 'carousel-card-center';
    if (diff === 1) return 'carousel-card-right';
    if (diff === total - 1) return 'carousel-card-left';
    return 'carousel-card-hidden';
  };

  return (
    <section className="relative w-full overflow-hidden bg-sand pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 space-y-8 text-left relative z-10 w-full lg:max-w-[48%]">
          <div className="space-y-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block font-bold">tripzy · atlas vivant</span>
            <div className="relative inline-block">
              <h1 className="font-display text-5xl sm:text-7xl text-night font-light leading-[1.05] tracking-tight lowercase">
                Your world,<br />your story,<br />your <em className="italic font-light text-gold font-normal">journey</em>.
              </h1>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block opacity-65 text-coral">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 20C22 14 36 16 46 26M46 26L38 24M46 26L44 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            <p className="text-sm md:text-base text-[#475569]/90 max-w-md font-sans font-light leading-relaxed">AI-crafted journeys across timeless places, real stories, and unforgettable experiences.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button onClick={onGoToPlanner} className="px-8 py-4 rounded-full bg-ocean hover:bg-ocean/90 text-white text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 shadow-md cursor-pointer hover:scale-102 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" /> Plan Your Journey
            </button>
            <button onClick={onGoToExplore} className="px-6 py-4 rounded-full border border-warm-gray hover:border-night text-night text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-coral animate-ping" /> Watch Story
            </button>
          </div>
        </div>

        <div className="flex-grow w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-[480px]">
          <div className="perspective-carousel cursor-grab active:cursor-grabbing select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {HERO_CAROUSEL_ITEMS.map((item, idx) => {
              const cardClass = getCardClass(idx);
              const isActive = cardClass === 'carousel-card-center';
              return (
                <div key={item.id} className={`carousel-card ${cardClass} bg-white border border-warm-gray/40`}>
                  <div className="w-full h-full flex flex-col relative">
                    <div className="h-[55%] w-full overflow-hidden relative bg-cream">
                      <img src={item.bannerImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-bold text-white uppercase tracking-wider ${item.badgeColor}`}>{item.category}</span>
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/95">{item.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between text-left">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-2.5xl text-night font-light lowercase leading-tight">{item.title}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                            <span className="text-[10px] font-bold text-night mt-0.5">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted/80 leading-relaxed font-sans font-light line-clamp-3">{item.storyHook}</p>
                      </div>
                      <div className="pt-3 border-t border-warm-gray/30 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted">
                          <Users className="w-3.5 h-3.5 text-ocean" />
                          <span>{item.explorers} explorers loved this</span>
                        </div>
                        {isActive && (
                          <button onClick={handleSelectActiveTour} className="px-3.5 py-2 rounded-xl bg-night hover:bg-ocean text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1">
                            Explore Chapter <ArrowRight className="w-3 h-3 text-gold" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 items-center mt-3 z-10">
            <button onClick={handlePrevSlide} className="w-10 h-10 rounded-full border border-warm-gray/60 bg-white/80 hover:bg-white text-night/70 flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[10px] text-muted tracking-widest">{String(activeIndex + 1).padStart(2, '0')} / {String(HERO_CAROUSEL_ITEMS.length).padStart(2, '0')}</span>
            <button onClick={handleNextSlide} className="w-10 h-10 rounded-full border border-warm-gray/60 bg-white/80 hover:bg-white text-night/70 flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
