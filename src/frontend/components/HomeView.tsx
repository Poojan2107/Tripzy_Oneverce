"use client";
import { useState, useMemo, useRef } from "react";
import {
  Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Camera, Clock, Star, Users, ChevronLeft, ChevronRight
} from "lucide-react";
import { Tour } from "../types";
import ScrollReveal from "./ui/ScrollReveal";
import SafeImage from "./ui/SafeImage";

const CATEGORIES = [
  { id: "Spiritual", label: "Sacred India", mood: "Spiritual", image: "/images/cat-spiritual.jpg" },
  { id: "Adventure", label: "Mountain India", mood: "Adventure", image: "/images/cat-adventure.jpg" },
  { id: "Luxury", label: "Royal India", mood: "Luxury", image: "/images/cat-royal.jpg" },
  { id: "Food", label: "Food India", mood: "Food", image: "/images/cat-food.jpg" },
  { id: "Nature", label: "Nature India", mood: "Nature", image: "/images/cat-nature.jpg" },
  { id: "Hidden", label: "Hidden India", mood: "Hidden", image: "/images/cat-hidden.jpg" },
];

const STORIES = [
  {
    title: "A Sunrise in Varanasi",
    excerpt: "Watching the stone steps fade from deep indigo to rich saffron as Vedic hymns float across the morning mist is a memory that stays with you forever.",
    image: "/images/story-varanasi.jpg",
    author: "Priya Sharma",
    location: "Varanasi, Uttar Pradesh",
    avatar: "/images/avatar-priya.jpg",
    readTime: "4 min"
  },
  {
    title: "Three Days on a Kerala Houseboat",
    excerpt: "Drifting slowly along the Alleppey backwaters where palm trees bend to meet their own reflections. The world moves at a different pace here.",
    image: "/images/story-kerala.jpg",
    author: "Amit Patel",
    location: "Alleppey, Kerala",
    avatar: "/images/avatar-amit.jpg",
    readTime: "5 min"
  },
  {
    title: "Riding Through Ladakh",
    excerpt: "Navigating high altitude mountain trails. In the shadow of cliffside monasteries and jagged peaks, we found a silence that felt holy.",
    image: "/images/story-ladakh.jpg",
    author: "Vikram Rao",
    location: "Leh, Ladakh",
    avatar: "/images/avatar-vikram.jpg",
    readTime: "6 min"
  },
  {
    title: "Golden Forts and Desert Dunes",
    excerpt: "Sipping spiced chai on a sandstone rooftop in Jaisalmer as the sun turns the entire fortress into a mountain of gold. A medieval dream come alive.",
    image: "/images/tours/jaisalmer-banner.jpg",
    author: "Karan Johar",
    location: "Jaisalmer, Rajasthan",
    avatar: "/images/avatar-amit.jpg",
    readTime: "5 min"
  },
  {
    title: "Whispers of Vijayanagara",
    excerpt: "Climbing the giant boulder piles of Hampi at sunset. Below us, the Tungabhadra river wound past ruins that felt as old as time itself.",
    image: "/images/tours/hampi-banner.jpg",
    author: "Ananya Sen",
    location: "Hampi, Karnataka",
    avatar: "/images/avatar-priya.jpg",
    readTime: "6 min"
  },
  {
    title: "Trekking the Living Root Bridges",
    excerpt: "Descending into the misty valleys of Meghalaya. Walking across double-decker bridges grown from the living roots of rubber trees is surreal.",
    image: "/images/tours/cherrapunji-banner.jpg",
    author: "Rahul Verma",
    location: "Cherrapunji, Meghalaya",
    avatar: "/images/avatar-vikram.jpg",
    readTime: "7 min"
  },
];

interface HomeViewProps {
  tours: Tour[];
  wishlistIds: string[];
  loadingDestinations: boolean;
  onSearchClick: () => void;
  onQuickCategoryClick: (category: string) => void;
  onSelectTour: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
  onGoToExplore: () => void;
  onGoToPlanner: () => void;
}

const HERO_CAROUSEL_ITEMS = [
  {
    id: 'kerala-houseboats',
    title: 'Kerala Backwaters',
    subtitle: 'THE FLOATING WORLD',
    category: 'NATURE CHAPTER',
    badgeColor: 'bg-green-600',
    tag: 'Nature',
    storyHook: 'Drift in a thatched-roof houseboat past emerald paddy fields and sleeping lagoons.',
    bannerImage: '/images/tours/kerala-banner.jpg',
    explorers: '4.8K',
    rating: 4.9,
  },
  {
    id: 'kashmir-meadows',
    title: 'Kashmir Meadows',
    subtitle: 'THE VALLEY OF MEADOWS',
    category: 'LUXURY CHAPTER',
    badgeColor: 'bg-teal-600',
    tag: 'Luxury',
    storyHook: 'Wake up to floating flower markets and timber-carved houseboats surrounded by alpine mist.',
    bannerImage: '/images/tours/kashmir-banner.jpg',
    explorers: '3.1K',
    rating: 4.95,
  },
  {
    id: 'varanasi-spiritual',
    title: 'Varanasi',
    subtitle: 'THE SACRED RIVER',
    category: 'CULTURE CHAPTER',
    badgeColor: 'bg-orange-600',
    tag: 'Culture',
    storyHook: 'Watch the stone steps fade from indigo to rich saffron as Vedic hymns float across morning mist.',
    bannerImage: '/images/tours/varanasi-banner.jpg',
    explorers: '5.2K',
    rating: 4.98,
  },
  {
    id: 'ladakh-passes',
    title: 'Ladakh Peaks',
    subtitle: 'THE LAST HIMALAYAN ROAD',
    category: 'ADVENTURE CHAPTER',
    badgeColor: 'bg-red-600',
    tag: 'Adventure',
    storyHook: 'At 18,000 feet, the world falls silent. Cliffside monasteries touch cold high deserts.',
    bannerImage: '/images/tours/ladakh-banner.jpg',
    explorers: '2.9K',
    rating: 4.97,
  },
  {
    id: 'cherrapunji-roots',
    title: 'Meghalaya Forests',
    subtitle: 'THE CLOUD SANCTUARY',
    category: 'NATURE CHAPTER',
    badgeColor: 'bg-green-700',
    tag: 'Nature',
    storyHook: 'Descend into misty valleys and walk living root bridges woven across rushing rivers.',
    bannerImage: '/images/tours/cherrapunji-banner.jpg',
    explorers: '1.8K',
    rating: 4.91,
  },
  {
    id: 'jaisalmer-fort',
    title: 'Jaisalmer Dunes',
    subtitle: 'THE DESERT KINGDOM',
    category: 'HERITAGE CHAPTER',
    badgeColor: 'bg-amber-600',
    tag: 'Heritage',
    storyHook: 'Sleep inside an active medieval sandstone fort and ride camels across golden dunes.',
    bannerImage: '/images/tours/jaisalmer-banner.jpg',
    explorers: '3.6K',
    rating: 4.94,
  },
  {
    id: 'udaipur-mewar',
    title: 'Udaipur Palaces',
    subtitle: 'THE CITY OF LAKES',
    category: 'ROYAL CHAPTER',
    badgeColor: 'bg-purple-600',
    tag: 'Royal',
    storyHook: 'Stroll royal stone corridors where shimmering palace domes rise directly out of Lake Pichola.',
    bannerImage: '/images/tours/udaipur-banner.jpg',
    explorers: '4.2K',
    rating: 4.96,
  }
];

export default function HomeView({
  tours,
  wishlistIds,
  loadingDestinations,
  onSearchClick,
  onQuickCategoryClick,
  onSelectTour,
  onToggleWishlist,
  onGoToExplore,
  onGoToPlanner,
}: HomeViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance in px to be considered a swipe
    if (diffX > threshold) {
      handleNextSlide();
    } else if (diffX < -threshold) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Select featured destinations for Section 04: Varanasi, Kerala, Ladakh, Jaisalmer
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

  const handleNextSlide = () => {
    setActiveIndex(prev => (prev + 1) % HERO_CAROUSEL_ITEMS.length);
  };

  const handlePrevSlide = () => {
    setActiveIndex(prev => (prev - 1 + HERO_CAROUSEL_ITEMS.length) % HERO_CAROUSEL_ITEMS.length);
  };

  const activeSlide = HERO_CAROUSEL_ITEMS[activeIndex];

  const handleSelectActiveTour = () => {
    const matched = tours.find(t => t.id === activeSlide.id);
    if (matched) {
      onSelectTour(matched);
    } else {
      onGoToExplore();
    }
  };

  const getCardClass = (index: number) => {
    const total = HERO_CAROUSEL_ITEMS.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return 'carousel-card-center';
    if (diff === 1) return 'carousel-card-right';
    if (diff === total - 1) return 'carousel-card-left';
    return 'carousel-card-hidden';
  };

  const findTourForStory = (story: any) => {
    return tours.find(t => 
      story.title.toLowerCase().includes(t.title.toLowerCase()) ||
      t.location.toLowerCase().includes(typeof story.location === 'string' ? story.location.split(',')[0]?.toLowerCase() || '' : '')
    );
  };

  const dynamicStories = useMemo(() => {
    const allReviews = tours.flatMap((t) =>
      (t.reviews || []).map((r) => ({
        title: `Journey through ${t.title}`,
        excerpt: r.comment,
        image: t.bannerImage,
        author: r.author,
        location: t.location,
        avatar: r.avatar || "/images/avatar-priya.jpg",
        readTime: "4 min"
      }))
    );
    const combined = [...allReviews, ...STORIES];
    const uniqueStories = combined.filter((story, index, self) =>
      index === self.findIndex((s) => s.title === story.title)
    );
    return uniqueStories.slice(0, 6);
  }, [tours]);

  return (
    <div className="bg-sand min-h-[100dvh] text-night selection:bg-coral/20 selection:text-night">
      
      {/* ── SECTION 01: SPLIT HERO WITH 3D CARD CAROUSEL ── */}
      <section className="relative w-full overflow-hidden bg-sand pt-24 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Column: Core Message and CTAs */}
          <div className="flex-1 space-y-8 text-left relative z-10 w-full lg:max-w-[48%]">
            <div className="space-y-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block font-bold">
                tripzy · atlas vivant
              </span>
              <div className="relative inline-block">
                <h1 className="font-display text-5xl sm:text-7xl text-night font-light leading-[1.05] tracking-tight lowercase">
                  Your world,<br />
                  your story,<br />
                  your <em className="italic font-light text-gold font-normal">journey</em>.
                </h1>
                {/* Decorative hand-drawn arrow SVG */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block opacity-65 text-coral">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20C22 14 36 16 46 26M46 26L38 24M46 26L44 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <p className="text-sm md:text-base text-[#475569]/90 max-w-md font-sans font-light leading-relaxed">
                AI-crafted journeys across timeless places, real stories, and unforgettable experiences.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={onGoToPlanner}
                className="px-8 py-4 rounded-full bg-ocean hover:bg-ocean/90 text-white text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 shadow-md cursor-pointer hover:scale-102 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                Plan Your Journey
              </button>
              <button 
                onClick={onGoToExplore}
                className="px-6 py-4 rounded-full border border-warm-gray hover:border-night text-night text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-coral animate-ping" />
                Watch Story
              </button>
            </div>
          </div>

          {/* Right Column: 3D Stack Card Carousel */}
          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-[480px]">
            <div 
              className="perspective-carousel cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {HERO_CAROUSEL_ITEMS.map((item, idx) => {
                const cardClass = getCardClass(idx);
                const isActive = cardClass === 'carousel-card-center';
                return (
                  <div
                    key={item.id}
                    className={`carousel-card ${cardClass} bg-white border border-warm-gray/40`}
                  >
                    <div className="w-full h-full flex flex-col relative">
                      {/* Image block */}
                      <div className="h-[55%] w-full overflow-hidden relative bg-cream">
                        <img 
                          src={item.bannerImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-bold text-white uppercase tracking-wider ${item.badgeColor}`}>
                          {item.category}
                        </span>
                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/95">{item.subtitle}</span>
                        </div>
                      </div>
                      
                      {/* Content block */}
                      <div className="flex-1 p-5 flex flex-col justify-between text-left">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display text-2.5xl text-night font-light lowercase leading-none leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                              <span className="text-[10px] font-bold text-night mt-0.5">{item.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted/80 leading-relaxed font-sans font-light line-clamp-3">
                            {item.storyHook}
                          </p>
                        </div>

                        {/* Bottom stats/CTA */}
                        <div className="pt-3 border-t border-warm-gray/30 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted">
                            <Users className="w-3.5 h-3.5 text-ocean" />
                            <span>{item.explorers} explorers loved this</span>
                          </div>
                          {isActive && (
                            <button
                              onClick={handleSelectActiveTour}
                              className="px-3.5 py-2 rounded-xl bg-night hover:bg-ocean text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                            >
                              Explore Chapter
                              <ArrowRight className="w-3 h-3 text-gold" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Carousel navigation triggers */}
            <div className="flex gap-4 items-center mt-3 z-10">
              <button 
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full border border-warm-gray/60 bg-white/80 hover:bg-white text-night/70 flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-[10px] text-muted tracking-widest">
                {String(activeIndex + 1).padStart(2, '0')} / {String(HERO_CAROUSEL_ITEMS.length).padStart(2, '0')}
              </span>
              <button 
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full border border-warm-gray/60 bg-white/80 hover:bg-white text-night/70 flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 01.5: FLOATING STATUS CAPSULE ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 -mt-4 mb-12 relative z-20">
        <div className="bg-white rounded-[28px] p-4 shadow-card border border-warm-gray/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-sand/40 border border-transparent hover:border-warm-gray/35 transition-all duration-300 group cursor-default">
            <div className="w-11 h-11 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-4.5 h-4.5 text-ocean animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-ocean transition-colors">AI-Powered Itineraries</h4>
              <p className="text-[10px] text-[#475569] leading-tight">Personalized travel guides for you</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-sand/40 border border-transparent hover:border-warm-gray/35 transition-all duration-300 group cursor-default">
            <div className="w-11 h-11 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-4.5 h-4.5 text-coral" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-coral transition-colors">Curated Experiences</h4>
              <p className="text-[10px] text-[#475569] leading-tight">Handpicked secrets by locals</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-sand/40 border border-transparent hover:border-warm-gray/35 transition-all duration-300 group cursor-default">
            <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-4.5 h-4.5 text-gold" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-gold transition-colors">Real Stories</h4>
              <p className="text-[10px] text-[#475569] leading-tight">Authentic reviews from travelers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-sand/40 border border-transparent hover:border-warm-gray/35 transition-all duration-300 group cursor-default">
            <div className="w-11 h-11 rounded-full bg-sky/10 text-sky flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-4.5 h-4.5 text-sky" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-sky transition-colors">Save & Share Journeys</h4>
              <p className="text-[10px] text-[#475569] leading-tight">Archive memories in your Passport</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 02: INDIA THROUGH JOURNEYS ── */}
      <section className="py-12 md:py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-8 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">
                discover by archetype
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
                india through <em className="italic font-light text-gold">journeys</em>
              </h2>
            </div>
          </ScrollReveal>

          {/* Horizontal scroll catalog chips */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-snap-x -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16 max-w-[100vw]">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => onQuickCategoryClick(cat.id)}
                className="snap-card flex-shrink-0 w-64 h-36 relative rounded-2xl overflow-hidden cursor-pointer group text-left border border-warm-gray/40"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={e => { e.currentTarget.style.opacity = '0' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">
                    {cat.mood}
                  </span>
                  <span className="font-display text-xl text-white font-light lowercase">
                    {cat.label}
                  </span>
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: WHY TRIPZY ── */}
      <section className="py-12 md:py-16 border-y border-warm-gray/30 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral">
                  <BookOpen className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  editorial chapters
                </h3>
                <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">
                  Unveil the secret corners of India through curated region-specific chapters. Not just lists, but stories that explore local culture and hidden treasures.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center text-ocean">
                  <Sparkles className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  ai journey generator
                </h3>
                <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">
                  Bespoke day-wise itineraries engineered to match your companion, pace, style, and budget, complete in less than 60 seconds with ₹ INR pricing.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Compass className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  atlas discovery
                </h3>
                <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">
                  Interact with real coordinates, regional color maps, photography guides, and local secrets on our split-screen Explore Atlas.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 04: FEATURED CHAPTERS ── */}
      <section className="py-14 md:py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">
                regional profiles
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em]">
                featured <em className="italic font-light text-gold">chapters</em> of the sub-continent
              </h2>
            </div>
          </ScrollReveal>

          {/* Asymmetrical Editorial Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
              if (!tour) return (
                <div key={idx} className="flex flex-col space-y-4 text-left animate-pulse w-full">
                  <div className="relative aspect-[16/9] rounded-3xl bg-cream/70" />
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between">
                      <div className="w-1/4 h-3 bg-cream rounded" />
                      <div className="w-1/5 h-3 bg-cream rounded" />
                    </div>
                    <div className="w-2/3 h-6 bg-cream rounded" />
                    <div className="w-full h-4 bg-cream rounded" />
                  </div>
                </div>
              );
              
              const isEven = idx % 2 === 0;
              const accentColor = tour.accents?.primary || '#FDB62F';

              return (
                <ScrollReveal key={tour.id} delay={(idx % 2) as 0 | 1}>
                  <div 
                    onClick={() => onSelectTour(tour)}
                    className={`flex flex-col cursor-pointer group space-y-4 text-left ${
                      !isEven ? 'md:mt-12' : ''
                    }`}
                  >
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm border border-warm-gray/30 bg-cream">
                      <img
                        src={tour.bannerImage}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        loading="lazy"
                        decoding="async"
                        onError={e => { e.currentTarget.style.opacity = '0' }}
                      />
                      {/* Regional theme color overlay on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" 
                        style={{ backgroundColor: accentColor }}
                      />
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); onToggleWishlist(tour.id); }}
                          className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform border border-warm-gray/40"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              wishlistIds.includes(tour.id) 
                                ? 'fill-rose-500 text-rose-500' 
                                : 'text-slate-400'
                            }`} 
                          />
                        </button>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="inline-block px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider mb-2">
                          {tour.bestSeason || 'All Season'}
                        </span>
                      </div>
                    </div>

                    <div className="px-1 space-y-2.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-muted uppercase tracking-widest">
                        <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                        <span>{tour.location.split(',')[0]}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {tour.moods?.[0] && (
                          <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-[8px] font-bold uppercase tracking-wider border border-coral/20 leading-none">
                            {tour.moods[0]}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-muted uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-ocean" />
                          {tour.duration}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-3xl text-night font-light leading-none lowercase group-hover:text-coral transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-sm text-muted font-sans font-light leading-tight">
                        {tour.subtitle}
                      </p>

                      <p className="text-xs text-muted/95 leading-relaxed font-light font-sans">
                        {tour.description}
                      </p>

                      <div className="pt-2 border-t border-warm-gray/30 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
                          <Camera className="w-3.5 h-3.5 text-gold" />
                          <span className="truncate max-w-[200px]">{tour.localSecret || 'Ask a local'}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-coral flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Chapter
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 05: TRAVELER STORIES ── */}
      <section className="py-16 md:py-24 bg-white border-t border-warm-gray/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-12 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">
                chronicles of movement
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
                traveler <em className="italic font-light text-gold">stories</em>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dynamicStories.map((story, i) => (
              <ScrollReveal key={story.title + "-" + i} delay={(i % 3) as 0 | 1 | 2}>
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    const matched = findTourForStory(story);
                    if (matched) onSelectTour(matched);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const matched = findTourForStory(story); if (matched) onSelectTour(matched); } }}
                  className="flex flex-col space-y-4 cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-warm-gray/30 bg-cream">
                    <SafeImage 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" 
                    />
                    <span className="absolute bottom-3 left-4 text-[8px] font-mono text-white bg-black/45 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {story.readTime} read
                    </span>
                  </div>
                  <div className="space-y-2 text-left">
                    <span className="text-[8px] font-mono text-coral uppercase tracking-widest block">
                      {story.location}
                    </span>
                    <h3 className="font-display text-2xl text-night font-light lowercase group-hover:text-coral transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-warm-gray/30">
                      <SafeImage src={story.avatar} alt={story.author} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-night/80">{story.author}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06: JOURNEY BUILDER CTA ── */}
      <section className="py-16 md:py-24 bg-cream/30 border-t border-warm-gray/30">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 text-center">
          <div className="relative border border-gold/30 rounded-[32px] p-8 md:p-14 bg-white/60 backdrop-blur-sm overflow-hidden shadow-soft">
            <div className="absolute inset-0 bg-radial-gradient(circle, rgba(253,182,47,0.05) 0%, transparent 100%) pointer-events-none" />
            
            <ScrollReveal>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-coral block mb-4 font-bold">
                the voyage awaits
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em] leading-[1.05] mb-6">
                script your own <br />
                <span className="italic font-light text-gold font-normal">indian odyssey</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-light max-w-xl mx-auto mb-8 font-sans">
                Our journey builder crafts customized itineraries rooted in local secrets, signature food experiences, and real coordinates — in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onGoToPlanner}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-ocean transition-all duration-300 cursor-pointer shadow-md hover:scale-102 animate-bounce-slow"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  Plan Your Journey
                </button>
                <button
                  onClick={onGoToExplore}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-night text-night text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-night hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  Browse Atlas
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
