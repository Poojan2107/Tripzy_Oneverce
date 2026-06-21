import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

const AFFILIATE_LABELS: Record<string, string> = {
  goibibo: 'Goibibo',
  agoda: 'Agoda',
  makemytrip: 'MakeMyTrip',
};

const AFFILIATE_COLORS: Record<string, string> = {
  goibibo: 'bg-saffron/10 text-[#C95C1E] border-saffron/20 hover:bg-saffron/20 hover:border-saffron/30',
  agoda: 'bg-ocean/15 text-[#3575B5] border-ocean/30 hover:bg-ocean/25 hover:border-ocean-dark/40',
  makemytrip: 'bg-sage/15 text-[#4D6950] border-sage/30 hover:bg-sage/25 hover:border-sage/40',
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2);
    return (
      <span className="text-gold text-xs">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-56 h-40 sm:h-auto shrink-0 relative overflow-hidden bg-cream">
          {imgFailed ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg font-display text-muted/30 font-bold uppercase">
                {hotel.name.charAt(0)}
              </span>
            </div>
          ) : (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-lg text-night font-bold leading-tight">{hotel.name}</h3>
              <span className="text-xs text-muted font-semibold whitespace-nowrap">{hotel.priceRange}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(hotel.rating)}
                <span className="text-[10px] font-bold text-night ml-0.5">{hotel.rating}</span>
              </div>
              <span className="text-[10px] text-muted/60">({hotel.reviews} reviews)</span>
              <span className="text-[10px] text-muted/30">|</span>
              <div className="flex items-center gap-1 text-muted">
                <MapPin className="w-2.5 h-2.5" />
                <span className="text-[9px]">{hotel.location}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted font-light leading-relaxed line-clamp-2">{hotel.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {hotel.amenities.slice(0, 4).map((a) => (
                <span key={a} className="px-2 py-0.5 rounded-full bg-sand/60 text-[8px] font-mono uppercase tracking-wider text-muted border border-warm-gray/60">
                  {a}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="px-2 py-0.5 rounded-full bg-sand/60 text-[8px] font-mono uppercase tracking-wider text-muted/50 border border-warm-gray/60">
                  +{hotel.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(hotel.affiliateLinks).filter(([, url]) => url).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-4 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all min-h-[44px] ${AFFILIATE_COLORS[key] || 'bg-sand text-muted border-warm-gray hover:bg-warm-gray'}`}
              >
                <ExternalLink className="w-2.5 h-2.5" />
                {AFFILIATE_LABELS[key] || key}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
