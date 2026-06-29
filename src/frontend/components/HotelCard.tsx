"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { Hotel } from '../types';
import { trackAffiliateClick } from '../utils/analytics';

interface HotelCardProps { hotel: Hotel; }

const AFFILIATE_LABELS: Record<string, string> = { goibibo: 'Goibibo', agoda: 'Agoda', makemytrip: 'MakeMyTrip' };
const AFFILIATE_COLORS: Record<string, string> = {
  goibibo: 'bg-orange-50/50 text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-800',
  agoda: 'bg-blue-50/50 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800',
  makemytrip: 'bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800',
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
    <motion.div
      className="bg-white rounded-3xl border border-border/50 overflow-hidden flex flex-col text-left shadow-card hover:shadow-hover transition-shadow"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)' }}
    >
      <div className="aspect-[3/2] w-full shrink-0 relative overflow-hidden bg-[#F2ECE3] group">
        {imgFailed ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-display text-muted/30 font-bold uppercase">{hotel.name.charAt(0)}</span>
          </div>
        ) : (
          <motion.img
            src={hotel.image} alt={hotel.name}
            className="w-full h-full object-cover"
            loading="lazy" decoding="async"
            onError={() => setImgFailed(true)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <h3 className="font-display text-2xl text-night font-light lowercase leading-tight">{hotel.name}</h3>
            <span className="text-xs font-bold text-coral bg-coral/5 border border-coral/15 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {hotel.priceRange}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted">
            <div className="flex items-center gap-1">
              {renderStars(hotel.rating)}
              <span className="font-bold text-night ml-1">{hotel.rating}</span>
            </div>
            <span className="text-border/60">|</span>
            <span className="text-muted/65">({hotel.reviews} reviews)</span>
            <span className="text-border/60">|</span>
            <div className="flex items-center gap-0.5 text-teal font-mono uppercase tracking-wider text-[8px] font-bold">
              <MapPin className="w-3.5 h-3.5 text-teal shrink-0" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted/80 font-light leading-relaxed line-clamp-2">{hotel.description}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span key={a} className="px-2.5 py-0.5 rounded-full bg-[#F8F4EE] text-[8px] font-mono uppercase tracking-wider text-muted/70 border border-border/40 leading-none">{a}</span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F8F4EE] text-[8px] font-mono uppercase tracking-wider text-muted/50 border border-border/40 leading-none">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full pt-3.5 border-t border-border/40">
          {Object.entries(hotel.affiliateLinks).filter(([, url]) => url).map(([key, url]) => (
            <motion.a key={key} href={url} target="_blank" rel="noopener noreferrer"
              onClick={() => trackAffiliateClick(hotel.id, hotel.name, key)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border min-h-[38px] transition-all ${AFFILIATE_COLORS[key] || 'bg-[#F8F4EE] text-muted border-border/40'}`}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <ExternalLink className="w-3 h-3 shrink-0" />
              {AFFILIATE_LABELS[key] || key}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}