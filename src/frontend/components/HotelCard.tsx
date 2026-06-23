import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Hotel } from '../types';
import { trackAffiliateClick } from '../utils/analytics';

interface HotelCardProps {
  hotel: Hotel;
}

const AFFILIATE_LABELS: Record<string, string> = {
  goibibo: 'Goibibo',
  agoda: 'Agoda',
  makemytrip: 'MakeMyTrip',
};

const AFFILIATE_COLORS: Record<string, string> = {
  goibibo: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50',
  agoda: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50',
  makemytrip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50',
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2);
    return (
      <span className="text-gold text-[10px] tracking-wider leading-none">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
    );
  };

  return (
    <div className="bg-[#0C2533] rounded-2xl border border-white/10 overflow-hidden hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row text-left">
      {/* Image container */}
      <div className="sm:w-52 h-44 sm:h-auto shrink-0 relative overflow-hidden bg-[#081A24] group">
        {imgFailed ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-display text-white/20 font-bold uppercase">
              {hotel.name.charAt(0)}
            </span>
          </div>
        ) : (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {/* Content details */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2.5 mb-1.5">
            <h3 className="font-display text-2xl text-white font-light lowercase leading-tight">
              {hotel.name}
            </h3>
            <span className="text-xs font-bold text-coral bg-coral/5 border border-coral/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {hotel.priceRange}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-3 text-[10px] text-white/50">
            <div className="flex items-center gap-1.5">
              {renderStars(hotel.rating)}
              <span className="font-bold text-white ml-0.5">{hotel.rating}</span>
            </div>
            <span className="text-white/10">|</span>
            <span className="text-white/50">({hotel.reviews} reviews)</span>
            <span className="text-white/10">|</span>
            <div className="flex items-center gap-1 text-[#148596] font-mono uppercase tracking-wider text-[9px] font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#148596] shrink-0" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-2">
            {hotel.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="px-2.5 py-0.5 rounded-full bg-white/5 text-[8px] font-mono uppercase tracking-wider text-white/50 border border-white/10 leading-none">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[8px] font-mono uppercase tracking-wider text-white/40 border border-white/10 leading-none">
                +{hotel.amenities.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Affiliate CTAs */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-white/10">
          {Object.entries(hotel.affiliateLinks).filter(([, url]) => url).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAffiliateClick(hotel.id, hotel.name, key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 min-h-[38px] ${AFFILIATE_COLORS[key] || 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {AFFILIATE_LABELS[key] || key}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
