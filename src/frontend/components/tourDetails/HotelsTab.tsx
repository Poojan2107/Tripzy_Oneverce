import { Compass, Sparkles } from 'lucide-react';
import { Tour } from '../../types';
import { getHotelsByDestination } from '../../data/hotels';
import HotelCard from '../HotelCard';

interface HotelsTabProps {
  tour: Tour;
  loadingHotels: boolean;
  onPlanClick: () => void;
}

export default function HotelsTab({ tour, loadingHotels, onPlanClick }: HotelsTabProps) {
  return (
    <div className="space-y-5 animate-fade-in text-left">
      <div>
        <h2 className="font-display text-section text-night font-bold mb-1">Where to Stay</h2>
        <p className="text-body text-muted/80 font-light">Curated hotels and stays in {tour.title}. Compare and reserve via our partner sites.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loadingHotels ? (
          Array(2).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-md border border-border/70 p-5 flex flex-col sm:flex-row gap-5 animate-pulse text-left">
              <div className="sm:w-52 h-44 sm:h-32 bg-secondary-surface rounded-md shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between"><div className="w-1/3 h-5 bg-secondary-surface rounded" /><div className="w-1/6 h-5 bg-secondary-surface rounded" /></div>
                <div className="w-1/4 h-3 bg-secondary-surface rounded" />
                <div className="w-full h-12 bg-secondary-surface rounded" />
                <div className="flex gap-2"><div className="w-16 h-8 bg-secondary-surface rounded-md" /><div className="w-16 h-8 bg-secondary-surface rounded-md" /></div>
              </div>
            </div>
          ))
        ) : getHotelsByDestination(tour.id).length > 0 ? (
          getHotelsByDestination(tour.id).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div className="p-8 py-10 rounded-lg bg-white border border-border/70 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto">
              <Compass className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h4 className="font-display text-card text-night font-light lowercase">stays are being curated</h4>
              <p className="text-body text-muted/85 font-light leading-relaxed mt-1">
                Our editors are hand-selecting the finest heritage retreats, eco-lodges, and boutique stays for {tour.title}. In the meantime, you can customize your daily logs in our journey builder.
              </p>
            </div>
            <button onClick={onPlanClick} className="btn btn-primary h-10 px-5 rounded-md text-caption inline-flex items-center gap-1.5 cursor-pointer shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-night" />
              <span>Launch Journey Builder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
