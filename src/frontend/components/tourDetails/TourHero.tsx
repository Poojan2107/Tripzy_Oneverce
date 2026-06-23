import { ArrowLeft, Heart, Share2, CheckCircle2, MapPin, Star } from 'lucide-react';
import { Tour } from '../../types';

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
  return (
    <div className="relative w-full h-[45vh] md:h-[60vh] min-h-[300px] md:min-h-[440px] overflow-hidden">
      <img src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.opacity = '0' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/25 transition-all cursor-pointer z-20 min-h-[44px]">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        <button onClick={onShare} className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer">
          {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
        </button>
        <button onClick={() => onToggleWishlist(tour.id)} className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer">
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
        <div className="flex items-center gap-3 mb-3">
          {tour.chapterName && (
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-white/70 uppercase tracking-widest">{tour.chapterName}</span>
          )}
          <span className="px-3 py-1 rounded-full bg-gold/90 text-[10px] font-bold text-white uppercase tracking-wider">96% Match</span>
          {tour.moods?.slice(0, 2).map(m => (
            <span key={m} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wider">{m}</span>
          ))}
        </div>
        <h1 className="font-display text-white lowercase font-light tracking-[-0.03em] leading-none" style={{ fontSize: 'clamp(44px, 7vw, 96px)', lineHeight: '0.88' }}>
          {tour.title}
        </h1>
        {tagline && <p className="text-sm text-white/60 font-light mt-3 italic max-w-md">{tagline}</p>}
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-gold" /> {tour.location}
          </span>
          <span className="text-white/30">|</span>
          <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest">{tour.duration}</span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-white/60">
            <Star className="w-3 h-3 fill-gold text-gold" />{tour.rating?.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
