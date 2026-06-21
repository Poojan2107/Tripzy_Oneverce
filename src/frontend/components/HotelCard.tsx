import { ExternalLink, MapPin, Star, BadgeCheck } from 'lucide-react';
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
  goibibo: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  agoda: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  makemytrip: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
};

export default function HotelCard({ hotel }: HotelCardProps) {
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
        <div className="sm:w-56 h-40 sm:h-auto shrink-0 relative overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={e => { e.currentTarget.style.opacity = '0.3' }}
          />
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all ${AFFILIATE_COLORS[key] || 'bg-sand text-muted border-warm-gray hover:bg-warm-gray'}`}
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
