"use client";
import { useState, useMemo } from "react";
import {
  Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Map, Calendar, Camera, Clock
} from "lucide-react";
import { Tour } from "../types";
import Hero from "./Hero";
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
  // Select featured destinations for Section 04: Varanasi, Kerala, Ladakh, Jaisalmer
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

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
    <div className="bg-sand min-h-screen text-night selection:bg-saffron/20 selection:text-night">
      {/* ── SECTION 01: HERO CAROUSEL ── */}
      <Hero
        tours={tours}
        onStartExploringClick={onGoToExplore}
        onSearchClick={onSearchClick}
        onQuickCategoryClick={onQuickCategoryClick}
        onSelectTour={onSelectTour}
      />

      {/* ── SECTION 02: INDIA THROUGH JOURNEYS ── */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-8 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron block mb-2 font-bold">
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
                className="snap-card flex-shrink-0 w-64 h-36 relative rounded-2xl overflow-hidden cursor-pointer group text-left border border-warm-gray"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      <section className="py-16 border-y border-warm-gray bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                  <BookOpen className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  editorial chapters
                </h3>
                <p className="text-xs text-night/70 leading-relaxed font-light">
                  Unveil the secret corners of India through curated region-specific chapters. Not just lists, but stories that explore local culture and hidden treasures.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Sparkles className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  ai journey generator
                </h3>
                <p className="text-xs text-night/70 leading-relaxed font-light">
                  Bespoke day-wise itineraries engineered to match your companion, pace, style, and budget, complete in less than 60 seconds with ₹ INR pricing.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-night/10 flex items-center justify-center text-night">
                  <Map className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-2xl text-night font-light lowercase">
                  atlas discovery
                </h3>
                <p className="text-xs text-night/70 leading-relaxed font-light">
                  Interact with real coordinates, regional color maps, photography guides, and local secrets on our split-screen Explore Atlas.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 04: FEATURED CHAPTERS ── */}
      <section className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron block mb-2 font-bold">
                regional profiles
              </span>
              <h2 className="font-display text-4.5xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em]">
                featured <em className="italic font-light text-gold">chapters</em> of the sub-continent
              </h2>
            </div>
          </ScrollReveal>

          {/* Asymmetrical Editorial Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
              if (!tour) return (
                <div key={idx} className="aspect-[16/9] rounded-2xl bg-cream animate-pulse" />
              );
              
              const isEven = idx % 2 === 0;
              const accentColor = tour.accents?.primary || '#D6A85F';

              return (
                <ScrollReveal key={tour.id} delay={(idx % 2) as 0 | 1}>
                  <div 
                    onClick={() => onSelectTour(tour)}
                    className={`flex flex-col cursor-pointer group space-y-4 text-left ${
                      !isEven ? 'md:mt-12' : ''
                    }`}
                  >
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm border border-warm-gray bg-cream">
                      <img
                        src={tour.bannerImage}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
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
                          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform"
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
                        <span className="inline-block px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider mb-2">
                          {tour.bestSeason || 'All Season'}
                        </span>
                      </div>
                    </div>

                    <div className="px-1 space-y-2.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-night/60 uppercase tracking-widest">
                        <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                        <span>{tour.location.split(',')[0]}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {tour.moods?.[0] && (
                          <span className="px-2 py-0.5 rounded-full bg-saffron/10 text-saffron text-[8px] font-bold uppercase tracking-wider border border-saffron/20 leading-none">
                            {tour.moods[0]}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-night/50 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tour.duration}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-3xl text-night font-light leading-none lowercase group-hover:text-saffron transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-sm text-night/50 font-sans font-light leading-tight">
                        {tour.subtitle}
                      </p>

                      <p className="text-xs text-night/70 leading-relaxed font-light">
                        {tour.description}
                      </p>

                      <div className="pt-2 border-t border-warm-gray flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-night/70">
                          <Camera className="w-3.5 h-3.5 text-gold" />
                          <span className="truncate max-w-[200px]">{tour.localSecret || 'Ask a local'}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
      <section className="py-24 bg-white border-t border-warm-gray">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <ScrollReveal>
            <div className="mb-12 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron block mb-2 font-bold">
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
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-warm-gray bg-cream">
                    <SafeImage 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" 
                    />
                    <span className="absolute bottom-3 left-4 text-[8px] font-mono text-white bg-black/45 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {story.readTime} read
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-saffron uppercase tracking-widest block">
                      {story.location}
                    </span>
                    <h3 className="font-display text-2xl text-night font-light lowercase group-hover:text-saffron transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-night/70 leading-relaxed font-light">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-warm-gray">
                      <SafeImage src={story.avatar} alt={story.author} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-night/70">{story.author}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06: JOURNEY BUILDER CTA ── */}
      <section className="py-24 bg-cream border-t border-warm-gray">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 text-center">
          <div className="relative border border-gold/30 rounded-[32px] p-8 md:p-14 bg-white/40 backdrop-blur-sm overflow-hidden shadow-soft">
            {/* Background elements */}
            <div className="absolute inset-0 bg-radial-gradient(circle, rgba(214,168,95,0.05) 0%, transparent 100%) pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full border border-gold/10 pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full border border-gold/10 pointer-events-none" />
            
            <ScrollReveal>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-saffron block mb-4 font-bold">
                the voyage awaits
              </span>
              <h2 className="font-display text-4.5xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em] leading-[1.05] mb-6">
                write your own <br />
                <span className="italic font-light text-gold font-normal">indian story</span>
              </h2>
              <p className="text-xs sm:text-sm text-night/70 leading-relaxed font-light max-w-xl mx-auto mb-8 font-sans">
                Our journey builder crafts customized itineraries rooted in local secrets, signature food experiences, and real coordinates — in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onGoToPlanner}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-saffron transition-all duration-300 cursor-pointer shadow-md hover:scale-102"
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
