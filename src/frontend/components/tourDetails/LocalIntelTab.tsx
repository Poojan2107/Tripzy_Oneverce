import { Sparkles, Leaf, CheckCircle2, AlertCircle, Compass, Star } from 'lucide-react';
import { Tour } from '../../types';
import { CulturalContext } from './data';

interface LocalIntelTabProps {
  tour: Tour;
  cultural: CulturalContext;
  dayTrips: Array<{ name: string; distance: string; type: string }>;
  accentColor: string;
}

export default function LocalIntelTab({ tour, cultural, dayTrips, accentColor }: LocalIntelTabProps) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold" />
          <h2 className="font-display text-section text-night font-bold">Must-Do Experiences</h2>
        </div>
        <div className="space-y-2">
          {(cultural.mustDo || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3.5 p-4 rounded-md bg-white border border-border/70 shadow-sm">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-meta font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: accentColor }}>{i + 1}</span>
              <p className="text-body text-night font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-4 h-4 text-sage" />
          <h2 className="font-display text-section text-night font-bold">Cultural Etiquette</h2>
        </div>
        <div className="p-5 rounded-lg bg-sage/5 border border-sage/20 space-y-3">
          {(cultural.etiquette || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-body text-muted/80 font-light">
              <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-coral" />
          <h2 className="font-display text-section text-night font-bold">Traveler Cautions</h2>
        </div>
        <div className="p-5 rounded-lg bg-coral/5 border border-coral/20 space-y-3">
          {(cultural.avoid || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-body text-muted/80 font-light">
              <AlertCircle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {dayTrips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-teal" />
            <h2 className="font-display text-section text-night font-bold">Nearby Day Trips</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dayTrips.map((trip, i) => (
              <div key={i} className="p-4 rounded-md bg-white border border-border/70 shadow-sm text-center">
                <span className="text-meta font-mono text-teal block mb-1">{trip.type}</span>
                <p className="text-body font-bold text-night mb-1">{trip.name}</p>
                <span className="text-meta text-muted font-light">{trip.distance} away</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tour.reviews.length > 0 && (
        <div>
          <h2 className="font-display text-section text-night font-bold mb-4">Traveler Notes</h2>
          <div className="space-y-4">
            {tour.reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-md bg-white border border-border/70 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-full object-cover border border-border" loading="lazy" decoding="async" onError={e => { e.currentTarget.style.opacity = '0' }} />
                  <div>
                    <p className="text-body font-bold text-night">{r.author}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-gold fill-gold" />
                      ))}
                      <span className="text-meta text-muted ml-1">{r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-body text-muted/80 font-light leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
