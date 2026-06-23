import { Sparkles, MapPin, BookOpen, Heart } from 'lucide-react';

export default function StatusCapsule() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 -mt-4 mb-12 relative z-20">
      <div className="bg-white rounded-[28px] p-4 shadow-card border border-warm-gray/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {[
          { icon: Sparkles, color: 'text-ocean', bg: 'bg-ocean/10', label: 'AI-Powered Itineraries', desc: 'Personalized travel guides for you' },
          { icon: MapPin, color: 'text-coral', bg: 'bg-coral/10', label: 'Curated Experiences', desc: 'Handpicked secrets by locals' },
          { icon: BookOpen, color: 'text-gold', bg: 'bg-gold/10', label: 'Real Stories', desc: 'Authentic reviews from travelers' },
          { icon: Heart, color: 'text-sky', bg: 'bg-sky/10', label: 'Save & Share Journeys', desc: 'Archive memories in your Passport' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-sand/40 border border-transparent hover:border-warm-gray/35 transition-all duration-300 group cursor-default">
              <div className={`w-11 h-11 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-4.5 h-4.5 ${item.color} ${i === 0 ? 'animate-pulse' : ''}`} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-night group-hover:text-ocean transition-colors">{item.label}</h4>
                <p className="text-[10px] text-[#475569] leading-tight">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
