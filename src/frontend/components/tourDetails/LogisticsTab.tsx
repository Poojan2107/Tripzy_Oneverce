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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl text-night font-bold mb-1">Plan & Reserve</h2>
        <p className="text-xs text-muted font-light">Everything you need to know before arriving, and how to plan your journey.</p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-4xl font-display font-bold text-night">{formatINR(tour.price)}</span>
            <span className="text-xs text-muted font-light ml-2">/ person per day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-bold text-sm text-night">{parseFloat(tour.rating.toFixed(1))}</span>
            <span className="text-xs text-muted font-light">({tour.reviewsCount} reviews)</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <button onClick={onPlanClick} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#148596] to-[#286F98] text-xs font-bold uppercase tracking-[0.15em] text-white hover:shadow-[0_4px_15px_rgba(20,133,150,0.3)] transition-all cursor-pointer hover:scale-101 border-none min-h-[46px]">
            <Sparkles className="w-4 h-4 text-[#FDB62F] animate-pulse" />
            <span>Generate AI Journey Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-border">
          <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Best Season</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-coral" />
            <span className="text-xs font-bold text-night">{tour.bestSeason || 'Oct – Mar'}</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-border">
          <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Difficulty</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sage" />
            <span className="text-xs font-bold text-night">{tour.difficulty}</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-border">
          <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Group Size</span>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-ocean" />
            <span className="text-xs font-bold text-night">{tour.groupSize}</span>
          </div>
        </div>
        {tour.budgetRange && (
          <div className="p-4 rounded-2xl bg-white border border-border">
            <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Budget Guide</span>
            <span className="text-xs font-bold text-night">{tour.budgetRange}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg text-night font-bold mb-3">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tour.includedServices.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-border">
              <ServiceIcon iconName={s.iconName} />
              <span className="text-xs text-night font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
