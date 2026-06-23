import { Tour } from '../../types';
import ServiceIcon from './ServiceIcon';

interface ItineraryTabProps {
  tour: Tour;
  activeDay: number;
  onDayChange: (day: number) => void;
  accentColor: string;
}

export default function ItineraryTab({ tour, activeDay, onDayChange, accentColor }: ItineraryTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl text-night font-bold mb-1">Daily Itinerary</h2>
        <p className="text-xs text-muted font-light">Each day is crafted around natural rhythms — sunrise rituals, midday exploration, and evening culture.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {tour.itinerary.map((day) => (
          <button key={day.day} onClick={() => onDayChange(day.day)} className={`px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border cursor-pointer min-h-[44px] flex items-center ${activeDay === day.day ? 'bg-night text-white border-night' : 'bg-white text-muted border-warm-gray hover:border-ocean/30'}`}>
            Day {day.day}
          </button>
        ))}
      </div>
      {tour.itinerary.filter(d => d.day === activeDay).map((day) => (
        <div key={day.day} className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card animate-scale-in space-y-4">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">Day {day.day}</span>
            <h3 className="font-display text-xl text-night font-bold">{day.title}</h3>
            <p className="text-xs text-muted font-light mt-2 leading-relaxed">{day.description}</p>
          </div>
          {day.activities.length > 0 && (
            <div className="border-t border-warm-gray/30 pt-4 space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted/50 font-bold">Activities</span>
              <ul className="space-y-2">
                {day.activities.map((a, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-muted font-light">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      <div>
        <h2 className="font-display text-xl text-night font-bold mb-4">What's Included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tour.includedServices.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-warm-gray">
              <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center"><ServiceIcon iconName={s.iconName} /></div>
              <span className="text-xs text-night font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
