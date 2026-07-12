import { Star, Sparkles, Calendar, Zap, User } from 'lucide-react';
import { Tour } from '../../types';
import { formatINR } from '../../utils/currency';
import ServiceIcon from './ServiceIcon';

interface LogisticsTabProps {
  tour: Tour;
  onPlanClick: () => void;
}

export default function LogisticsTab({ tour, onPlanClick }: LogisticsTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h2 className="font-display text-section text-night font-bold mb-1">Plan & Prepare</h2>
        <p className="text-body text-muted/80 font-light">Everything you need to know before arriving, and how to plan your journey.</p>
      </div>
 
      <div className="p-6 rounded-lg bg-white border border-border/70 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-heading font-display font-bold text-night">{formatINR(tour.price)}</span>
            <span className="text-meta text-muted ml-2">/ person per day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-bold text-sm text-night">{(tour.rating ?? 0).toFixed(1)}</span>
            <span className="text-meta text-muted">({tour.reviewsCount} reviews)</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <button onClick={onPlanClick} className="btn btn-primary w-full h-12 rounded-md text-caption flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/10">
            <Sparkles className="w-4 h-4 text-night animate-pulse" />
            <span>Generate AI Journey Plan</span>
          </button>
        </div>
      </div>
 
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
          <span className="text-meta font-mono text-muted/50 block mb-2">Best Season</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-coral" />
            <span className="text-body font-bold text-night">{tour.bestSeason || 'Oct – Mar'}</span>
          </div>
        </div>
        <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
          <span className="text-meta font-mono text-muted/50 block mb-2">Difficulty</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sage" />
            <span className="text-body font-bold text-night">{tour.difficulty}</span>
          </div>
        </div>
        <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
          <span className="text-meta font-mono text-muted/50 block mb-2">Group Size</span>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-teal" />
            <span className="text-body font-bold text-night">{tour.groupSize}</span>
          </div>
        </div>
        {tour.budgetRange && (
          <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
            <span className="text-meta font-mono text-muted/50 block mb-2">Budget Guide</span>
            <span className="text-body font-bold text-night">{tour.budgetRange}</span>
          </div>
        )}
      </div>
 
      <div>
        <h3 className="font-display text-section text-night font-bold mb-3">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tour.includedServices.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-md bg-white border border-border/70 shadow-sm">
              <ServiceIcon iconName={s.iconName} />
              <span className="text-body text-night font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
