"use client";
import { useState } from "react";
import {
  Sparkles, ArrowRight, MapPin, Heart, Compass, BookOpen, Map, Calendar, Camera
} from "lucide-react";
import { Tour } from "../types";
import Hero from "./Hero";
import ScrollReveal from "./ui/ScrollReveal";

const CATEGORIES = [
  { id: "Spiritual", label: "Sacred India", mood: "Spiritual", image: "https://images.unsplash.com/photo-1561361058-c24e01d68e37?q=80&w=600&auto=format&fit=crop" },
  { id: "Adventure", label: "Mountain India", mood: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop" },
  { id: "Luxury", label: "Royal India", mood: "Luxury", image: "https://images.unsplash.com/photo-1562158074-a2b1660d5bfa?q=80&w=600&auto=format&fit=crop" },
  { id: "Food", label: "Food India", mood: "Food", image: "https://images.unsplash.com/photo-1596797882943-1912443d347b?q=80&w=600&auto=format&fit=crop" },
  { id: "Nature", label: "Nature India", mood: "Nature", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop" },
  { id: "Hidden", label: "Hidden India", mood: "Hidden", image: "https://images.unsplash.com/photo-1600100397607-b3ff15bc86d4?q=80&w=600&auto=format&fit=crop" },
];

const STORIES = [
  {
    title: "A Sunrise in Varanasi",
    excerpt: "Watching the stone steps fade from deep indigo to rich saffron as Vedic hymns float across the morning mist is a memory that stays with you forever.",
    image: "https://images.unsplash.com/photo-1561361058-c24e01d68e37?q=80&w=800&auto=format&fit=crop",
    author: "Priya Sharma",
    location: "Varanasi, Uttar Pradesh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
    readTime: "4 min"
  },
  {
    title: "Three Days on a Kerala Houseboat",
    excerpt: "Drifting slowly along the Alleppey backwaters where palm trees bend to meet their own reflections. The world moves at a different pace here.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop",
    author: "Amit Patel",
    location: "Alleppey, Kerala",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    readTime: "5 min"
  },
  {
    title: "Riding Through Ladakh",
    excerpt: "Navigating high altitude mountain trails. In the shadow of cliffside monasteries and jagged peaks, we found a silence that felt holy.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    author: "Vikram Rao",
    location: "Leh, Ladakh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
    readTime: "6 min"
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
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-snap-x -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16">
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
                <div key={idx} className="aspect-[4/3] rounded-2xl bg-cream animate-pulse" />
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
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-warm-gray bg-cream">
                      <img
                        src={tour.bannerImage}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
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

                    <div className="px-1 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-night/60 uppercase tracking-widest">
                        <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                        <span>{tour.location.split(',')[0]}</span>
                      </div>
                      
                      <h3 className="font-display text-3xl text-night font-light leading-none lowercase group-hover:text-saffron transition-colors">
                        {tour.title} — <span className="font-sans text-lg font-light text-night/60">{tour.subtitle}</span>
                      </h3>

                      <p className="text-xs text-night/70 leading-relaxed font-light line-clamp-2">
                        {tour.description}
                      </p>

                      <div className="pt-2 border-t border-warm-gray flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-night/70">
                          <Camera className="w-3.5 h-3.5 text-gold" />
                          <span className="truncate max-w-[200px]">Secret: {tour.localSecret || 'Ask a local'}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          read stories
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
      <section className="py-20 bg-white border-t border-warm-gray">
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
            {STORIES.map((story, i) => (
              <ScrollReveal key={story.title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="flex flex-col space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-warm-gray bg-cream">
                    <img 
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
                    <h3 className="font-display text-2xl text-night font-light lowercase">
                      {story.title}
                    </h3>
                    <p className="text-xs text-night/70 leading-relaxed font-light">
                      &ldquo;{story.excerpt}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-warm-gray">
                      <img src={story.avatar} alt={story.author} className="w-8 h-8 rounded-full object-cover" />
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
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <ScrollReveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron block mb-3 font-bold">
              the voyage awaits
            </span>
            <h2 className="font-display text-5xl sm:text-6xl text-night lowercase font-light tracking-[-0.03em] leading-tight">
              write your own <br />
              <em className="italic font-light text-gold">indian story</em>
            </h2>
            <p className="text-sm text-night/70 leading-relaxed font-light max-w-md mx-auto">
              Our AI engine crafts hyper-customized itineraries mapping local secrets, signature food experiences, and coordinates in under a minute.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGoToPlanner}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-night text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-saffron transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Plan Your Journey
              </button>
              <button
                onClick={onGoToExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-night text-night text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-night hover:text-white transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Browse Atlas
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
