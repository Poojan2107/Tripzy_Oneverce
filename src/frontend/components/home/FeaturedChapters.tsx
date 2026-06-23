"use client";
import { Clock, Camera, ArrowRight, Heart } from 'lucide-react';
import { Tour } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';

interface FeaturedChaptersProps {
  tours: Tour[];
  wishlistIds: string[];
  loadingDestinations: boolean;
  onSelectTour: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
}

export default function FeaturedChapters({ tours, wishlistIds, loadingDestinations, onSelectTour, onToggleWishlist }: FeaturedChaptersProps) {
  const featuredIds = ['varanasi-spiritual', 'kerala-houseboats', 'ladakh-passes', 'jaisalmer-fort'];
  const featuredChapters = tours.filter(t => featuredIds.includes(t.id));

  return (
    <section className="py-14 md:py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">regional profiles</span>
            <h2 className="font-display text-4xl sm:text-6xl text-night lowercase font-light tracking-[-0.04em]">
              featured <em className="italic font-light text-gold">chapters</em> of the sub-continent
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {(loadingDestinations ? Array(4).fill(null) : featuredChapters).map((tour, idx) => {
            if (!tour) return (
              <div key={idx} className="flex flex-col space-y-4 text-left animate-pulse w-full">
                <div className="relative aspect-[16/9] rounded-3xl bg-cream/70" />
                <div className="px-1 space-y-2">
                  <div className="flex justify-between"><div className="w-1/4 h-3 bg-cream rounded" /><div className="w-1/5 h-3 bg-cream rounded" /></div>
                  <div className="w-2/3 h-6 bg-cream rounded" /><div className="w-full h-4 bg-cream rounded" />
                </div>
              </div>
            );

            const isEven = idx % 2 === 0;
            const accentColor = tour.accents?.primary || '#FDB62F';

            return (
              <ScrollReveal key={tour.id} delay={(idx % 2) as 0 | 1}>
                <div onClick={() => onSelectTour(tour)} className={`flex flex-col cursor-pointer group space-y-4 text-left ${!isEven ? 'md:mt-12' : ''}`}>
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm border border-warm-gray/30 bg-cream">
                    <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" style={{ backgroundColor: accentColor }} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={e => { e.stopPropagation(); onToggleWishlist(tour.id); }} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform border border-warm-gray/40">
                        <Heart className={`w-4 h-4 ${wishlistIds.includes(tour.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <span className="inline-block px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider mb-2">{tour.bestSeason || 'All Season'}</span>
                    </div>
                  </div>
                  <div className="px-1 space-y-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-muted uppercase tracking-widest">
                      <span>{tour.chapterName || `Chapter ${idx + 1}`}</span>
                      <span>{tour.location.split(',')[0]}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {tour.moods?.[0] && <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-[8px] font-bold uppercase tracking-wider border border-coral/20 leading-none">{tour.moods[0]}</span>}
                      <span className="text-[9px] font-mono text-muted uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3 text-ocean" />{tour.duration}</span>
                    </div>
                    <h3 className="font-display text-3xl text-night font-light leading-none lowercase group-hover:text-coral transition-colors">{tour.title}</h3>
                    <p className="text-sm text-muted font-sans font-light leading-tight">{tour.subtitle}</p>
                    <p className="text-xs text-muted/95 leading-relaxed font-light font-sans">{tour.description}</p>
                    <div className="pt-2 border-t border-warm-gray/30 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
                        <Camera className="w-3.5 h-3.5 text-gold" />
                        <span className="truncate max-w-[200px]">{tour.localSecret || 'Ask a local'}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-coral flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Chapter <ArrowRight className="w-3 h-3" />
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
  );
}
