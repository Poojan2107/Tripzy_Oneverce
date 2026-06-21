"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Tour } from "../types";
import { useAtmosphere } from "../utils/AtmosphereContext";

interface HeroProps {
  tours: Tour[];
  onStartExploringClick: () => void;
  onSearchClick: () => void;
  onQuickCategoryClick: (category: string) => void;
  onSelectTour?: (tour: Tour) => void;
}

const CHAPTERS = [
  {
    id: "varanasi",
    location: "Varanasi, India",
    title: "varanasi",
    subtitle: "spiritual river heritage",
    category: "Spiritual • Heritage",
    story: "Dawn breaks over the sacred Ghats as priests perform the ancient Ganga Aarti — fire, incense and ten thousand years of devotion.",
    image: "/images/hero-varanasi.jpg",
    mood: "Spiritual",
    duration: "3 Days",
    temp: "28°C",
    tag: "INDIA",
    position: "object-[center_35%]",
  },
  {
    id: "kerala",
    location: "Alleppey, Kerala",
    title: "kerala",
    subtitle: "backwater floating silence",
    category: "Nature • Wellness",
    story: "Drift through ancient waterways on a teak houseboat as egrets skim the lotus ponds of God's Own Country.",
    image: "/images/hero-kerala.jpg",
    mood: "Nature",
    duration: "4 Days",
    temp: "30°C",
    tag: "INDIA",
    position: "object-center",
  },
  {
    id: "ladakh",
    location: "Leh, Ladakh",
    title: "ladakh",
    subtitle: "himalayan high passes",
    category: "Adventure • Nature",
    story: "At 18,380 ft, the world falls silent. Monasteries cling to cliffs above a cold desert that touches the sky.",
    image: "/images/hero-ladakh.jpg",
    mood: "Adventure",
    duration: "8 Days",
    temp: "12°C",
    tag: "INDIA",
    position: "object-[center_40%]",
  },
  {
    id: "kashmir",
    location: "Srinagar, Kashmir",
    title: "kashmir",
    subtitle: "alpine meadow walks",
    category: "Luxury • Nature",
    story: "Stay in heritage wooden houseboats on Dal Lake, drift through floating morning flower markets, and discover pine-forested alpine slopes.",
    image: "/images/hero-kashmir.jpg",
    mood: "Luxury",
    duration: "6 Days",
    temp: "18°C",
    tag: "INDIA",
    position: "object-center",
  },
  {
    id: "jaisalmer",
    location: "Jaisalmer, Rajasthan",
    title: "jaisalmer",
    subtitle: "golden desert dunes",
    category: "Culture • Adventure",
    story: "Sleep inside an active medieval sandstone fort, ride camels across the Thar, and camp under a desert sky.",
    image: "/images/hero-jaisalmer.jpg",
    mood: "Culture",
    duration: "3 Days",
    temp: "26°C",
    tag: "INDIA",
    position: "object-[center_35%]",
  },
];

export default function Hero({
  onStartExploringClick,
  onSelectTour,
  tours = [],
}: HeroProps) {
  const { setActiveLocation } = useAtmosphere();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = CHAPTERS[active];

  const goTo = (idx: number) => {
    if (transitioning || idx === active) return;
    setTransitioning(true);
    setPrev(active);
    setTimeout(() => {
      setActive(idx);
      setActiveLocation(CHAPTERS[idx].location);
      setPrev(null);
      setTransitioning(false);
    }, 600);
  };

  const next = () => goTo((active + 1) % CHAPTERS.length);
  const goToPrev = () => goTo((active - 1 + CHAPTERS.length) % CHAPTERS.length);

  // Auto-advance every 6s
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  useEffect(() => {
    setActiveLocation(CHAPTERS[0].location);
  }, []);

  const handleCTA = () => {
    if (onSelectTour && tours.length > 0) {
      const match = tours.find(t => t.id.includes(current.id));
      if (match) onSelectTour(match);
    } else {
      onStartExploringClick();
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden select-none">
      {/* ── FULL-BLEED BACKGROUND IMAGES ── */}
      {CHAPTERS.map((ch, idx) => (
        <div
          key={ch.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-cream"
          style={{ opacity: idx === active ? 1 : 0, zIndex: idx === active ? 1 : 0 }}
        >
          <img
            src={ch.image}
            alt={ch.title}
            className={`w-full h-full object-cover ${ch.position || 'object-center'}`}
            onError={e => { e.currentTarget.style.opacity = '0' }}
          />
          {/* Heavy gradient: dark bottom for text, subtle top for navbar */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── CONTENT OVERLAY ── */}
      <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-16 lg:px-20 pt-28 pb-8">

        {/* TOP: Location tag */}
        <div
          key={active + "-tag"}
          className="flex items-center gap-2 animate-fade-in"
        >
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 font-mono text-[9px] uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {current.location}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-gold/90 text-[8px] font-bold uppercase tracking-widest text-white">
            {current.tag}
          </span>
          <span className="text-white/40 text-[9px] font-mono uppercase tracking-widest">
            {current.category}
          </span>
        </div>

        {/* MIDDLE: Big editorial title */}
        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <p
            key={active + "-tagline"}
            className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-gold/80 mb-2 animate-fade-in"
          >
            Discover India Through 12 Handcrafted Chapters
          </p>
          <div
            key={active + "-title"}
            className={`transition-all duration-700 ${transitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}`}
          >
            <h1
              className="font-display text-white font-light lowercase leading-[0.85] tracking-[-0.03em]"
              style={{ fontSize: "clamp(72px, 11vw, 160px)" }}
            >
              {current.title}
            </h1>
            <h2
              className="font-display font-light lowercase leading-[0.85] tracking-[-0.02em] mt-1 text-gold"
              style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
            >
              {current.subtitle}
            </h2>
            <p className="mt-6 text-white/65 font-sans font-light text-base md:text-lg leading-relaxed max-w-xl">
              {current.story}
            </p>
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gold text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-gold-light transition-all duration-300 shadow-[0_4px_20px_rgba(214,168,95,0.4)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Explore This Journey
              </button>
              <button
                onClick={onStartExploringClick}
                className="inline-flex items-center gap-2 text-white/70 text-[11px] font-mono uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer group"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM: Thumbnail strip + progress + nav */}
        <div className="flex items-end justify-between gap-6">
          {/* Thumbnail navigation */}
          <div className="flex gap-3 flex-1 overflow-hidden">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); goTo(idx); }}
                className={`relative rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-500 ${
                  idx === active
                    ? "w-28 h-16 ring-2 ring-gold ring-offset-2 ring-offset-transparent"
                    : "w-14 h-14 opacity-50 hover:opacity-75"
                }`}
              >
                <img src={ch.image} alt={ch.title} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.opacity = '0' }} />
                {idx === active && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[8px] font-mono text-white uppercase tracking-wider leading-none">
                      {ch.title}
                    </span>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                      <div
                        key={active}
                        className="h-full bg-gold hero-progress-bar"
                      />
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Slide counter + arrows */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-mono text-[11px] text-white/50">
              {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); goToPrev(); }}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); next(); }}
                className="w-9 h-9 rounded-full bg-gold/80 hover:bg-gold flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce opacity-40">
        <div className="w-px h-8 bg-white" />
        <span className="text-white text-[8px] font-mono uppercase tracking-[0.3em]">scroll</span>
      </div>
    </section>
  );
}
