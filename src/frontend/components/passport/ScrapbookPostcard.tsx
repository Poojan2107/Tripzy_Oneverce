"use client";
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Tour } from '../../types';
import SafeImage from '../ui/SafeImage';

interface ScrapbookPostcardProps {
  tour: Tour;
  onRemove: () => void;
  onInspect: () => void;
}

export default function ScrapbookPostcard({ tour, onRemove, onInspect }: ScrapbookPostcardProps) {
  return (
    <motion.div
      onClick={onInspect}
      className="bg-surface border border-border/70 p-5 pb-6 rounded-lg cursor-pointer group flex flex-col justify-between text-left relative shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[3/2] rounded-md overflow-hidden bg-secondary-surface mb-4">
        <SafeImage src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-muted hover:text-coral hover:bg-coral/10 shadow-sm border border-border/70 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        <span className="text-meta font-mono text-gold block mb-1">{tour.location}</span>
        <h3 className="font-display text-card text-night font-light lowercase group-hover:text-gold transition-colors leading-tight">{tour.title}</h3>
        <p className="text-body text-muted/80 font-light line-clamp-2 mt-1 leading-relaxed">{tour.subtitle}</p>
        <div className="pt-3 flex justify-between items-center text-meta font-bold text-night border-t border-border mt-3">
          <span className="text-meta font-mono font-bold text-teal bg-teal/10 border border-teal/20 px-2.5 py-0.5 rounded-sm uppercase">
            {tour.moods?.[0] || 'Explore'}
          </span>
          <span className="text-meta font-mono font-bold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-sm uppercase">
            {tour.category || 'Chapter'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
