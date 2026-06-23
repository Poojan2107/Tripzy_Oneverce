import { Clock, User, Zap, Calendar, Star } from 'lucide-react';
import { Tour } from '../../types';

export default function StatsBar({ tour }: { tour: Tour }) {
  return (
    <div className="border-b border-warm-gray bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-gold" />
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Duration</p>
              <p className="text-xs font-bold text-night">{tour.duration}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-warm-gray" />
          <div className="flex items-center gap-2 shrink-0">
            <User className="w-4 h-4 text-ocean" />
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Group</p>
              <p className="text-xs font-bold text-night">{tour.groupSize}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-warm-gray" />
          <div className="flex items-center gap-2 shrink-0">
            <Zap className="w-4 h-4 text-sage" />
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Difficulty</p>
              <p className="text-xs font-bold text-night">{tour.difficulty}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-warm-gray" />
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="w-4 h-4 text-coral" />
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Best Time</p>
              <p className="text-xs font-bold text-night">{tour.bestSeason || 'Oct – Mar'}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-warm-gray" />
          <div className="flex items-center gap-2 shrink-0">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Rating</p>
              <p className="text-xs font-bold text-night">{parseFloat(tour.rating.toFixed(1))} ({tour.reviewsCount} reviews)</p>
            </div>
          </div>
          {tour.budgetRange && (
            <>
              <div className="w-px h-8 bg-warm-gray" />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg" style={{ lineHeight: 1 }}>₹</span>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Budget Range</p>
                  <p className="text-xs font-bold text-night">{tour.budgetRange}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
