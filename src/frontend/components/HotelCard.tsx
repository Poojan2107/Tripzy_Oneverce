"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { Hotel } from '../types';
import { trackAffiliateClick } from '../utils/analytics';
 
interface HotelCardProps { hotel: Hotel; }
 
const AFFILIATE_LABELS: Record<string, string> = { goibibo: 'Goibibo', agoda: 'Agoda', makemytrip: 'MakeMyTrip' };
const AFFILIATE_COLORS: Record<string, string> = {
  goibibo: 'bg-orange-50/40 text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-800',
  agoda: 'bg-blue-50/40 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800',
  makemytrip: 'bg-emerald-50/40 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800',
};
 
export default function HotelCard({ hotel }: HotelCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
 
  return (
    <motion.div
      className="bg-surface rounded-lg border border-border/70 overflow-hidden flex flex-col sm:flex-row text-left shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -2 }}
    >
      {/* 1. Image Section */}
      <div className="aspect-[16/10] sm:w-64 sm:aspect-square shrink-0 relative overflow-hidden bg-secondary-surface group p-3">
        <div className="w-full h-full rounded-md overflow-hidden relative">
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>
      </div>
 
      {/* 2. Content Details Section */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          
          {/* Header row: Name and Price */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display text-card text-night font-light lowercase leading-tight">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-meta font-mono text-muted/50 lowercase">
                <MapPin className="w-3 h-3 text-muted/40 shrink-0" />
                <span>{hotel.location}</span>
              </div>
            </div>
            <span className="text-meta font-mono font-bold text-coral bg-coral/5 border border-coral/15 px-2.5 py-0.5 rounded-sm whitespace-nowrap">
              {hotel.priceRange}
            </span>
          </div>
 
          {/* Recommendation Reason / Description */}
          <p className="text-body text-muted/80 font-light leading-relaxed line-clamp-3 pt-1">
            {hotel.description}
          </p>
 
        </div>
 
        {/* Affiliate Action Buttons */}
        <div className="flex items-center gap-2 w-full pt-3.5 border-t border-border/15">
          {Object.entries(hotel.affiliateLinks).filter(([, url]) => url).map(([key, url]) => (
            <motion.a key={key} href={url} target="_blank" rel="noopener noreferrer"
              onClick={() => trackAffiliateClick(hotel.id, hotel.name, key)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-md text-meta font-bold uppercase border transition-all cursor-pointer ${AFFILIATE_COLORS[key] || 'bg-background text-muted border-border/15'}`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <ExternalLink className="w-3 h-3 shrink-0" />
              {AFFILIATE_LABELS[key] || key}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}