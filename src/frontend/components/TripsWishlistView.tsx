"use client";
import { useState, useMemo } from 'react';
import { 
  Heart, Calendar, MapPin, CheckCircle2, Trash2, Printer, 
  ArrowRight, Sparkles, Compass, Clock, Award, Shield, User
} from 'lucide-react';
import { Tour } from '../types';

interface BookedItem {
  tourId: string;
  tourTitle: string;
  bannerImage: string;
  price: number;
  guests: number;
  date: string;
  fullName: string;
  email: string;
  bookingCode: string;
}

interface TripsWishlistViewProps {
  wishlistTours: Tour[];
  bookedTours: BookedItem[];
  savedItineraries: any[];
  onTourSelect: (tour: Tour) => void;
  onRemoveWishlist: (tourId: string) => void;
  onCancelExpedition: (bookingCode: string) => void;
  onNavigateExplore: () => void;
  onDeleteItinerary: (id: string) => void;
  onInspectItinerary?: (itin: any) => void;
}

function ScrapbookPostcard({ tour, onRemove, onInspect }: { tour: Tour; onRemove: () => void; onInspect: () => void; }) {
  return (
    <div 
      onClick={onInspect}
      className="bg-white p-4 pb-6 rounded-3xl border bg-cream shadow-sm hover:shadow-md hover:border-gold/35 transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left relative"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream mb-4">
        <img src={tour.bannerImage} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm border bg-cream cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        <span className="text-[8px] font-mono text-gold uppercase tracking-widest block">{tour.location.split(',')[0]}</span>
        <h3 className="font-display text-2xl text-night font-light leading-none lowercase">{tour.title}</h3>
        <p className="text-[10px] text-muted/60 font-light line-clamp-2 mt-1 leading-relaxed">{tour.subtitle}</p>
        <div className="pt-2 flex justify-between items-center text-xs font-bold text-night">
          <span>₹{(tour.price * 83).toLocaleString('en-IN')}</span>
          <span className="text-[9px] font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {tour.moods?.[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TripsWishlistView({
  wishlistTours,
  bookedTours,
  savedItineraries = [],
  onTourSelect,
  onRemoveWishlist,
  onCancelExpedition,
  onNavigateExplore,
  onDeleteItinerary,
  onInspectItinerary
}: TripsWishlistViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'wishlist' | 'itineraries'>('bookings');
  const [mockPrintCode, setMockPrintCode] = useState<string | null>(null);

  const triggerMockPrint = (code: string) => {
    setMockPrintCode(code);
    setTimeout(() => setMockPrintCode(null), 2500);
  };

  // List of all destinations booked or saved
  const checkedDestinationIds = useMemo(() => {
    const ids = new Set<string>();
    bookedTours.forEach(b => ids.add(b.tourId));
    savedItineraries.forEach(i => {
      if (i.destination) {
        // Find matching tour id
        if (i.destination.includes('varanasi')) ids.add('varanasi-spiritual');
        else if (i.destination.includes('kerala')) ids.add('kerala-houseboats');
        else if (i.destination.includes('ladakh')) ids.add('ladakh-passes');
        else if (i.destination.includes('kashmir')) ids.add('kashmir-meadows');
        else if (i.destination.includes('jaisalmer')) ids.add('jaisalmer-fort');
        else if (i.destination.includes('udaipur')) ids.add('udaipur-mewar');
        else if (i.destination.includes('munnar')) ids.add('munnar-tea');
        else if (i.destination.includes('goa')) ids.add('goa-beach');
        else if (i.destination.includes('hampi')) ids.add('hampi-ruins');
        else if (i.destination.includes('kutch')) ids.add('kutch-salt');
        else if (i.destination.includes('cherrapunji')) ids.add('cherrapunji-roots');
        else if (i.destination.includes('andaman')) ids.add('andaman-reefs');
      }
    });
    return ids;
  }, [bookedTours, savedItineraries]);

  // Dynamic Badge Checklist
  const badgesList = useMemo(() => {
    const checkBadge = (destIds: string[]) => destIds.some(id => checkedDestinationIds.has(id));
    return [
      { id: 'ganga', label: 'Ganga Pilgrim', desc: 'Varanasi', unlocked: checkBadge(['varanasi-spiritual']), color: '#E07B39' },
      { id: 'mountain', label: 'Mountain Nomad', desc: 'Ladakh or Kashmir', unlocked: checkBadge(['ladakh-passes', 'kashmir-meadows']), color: '#B71C1C' },
      { id: 'desert', label: 'Desert Wanderer', desc: 'Jaisalmer or Kutch', unlocked: checkBadge(['jaisalmer-fort', 'kutch-salt']), color: '#D84315' },
      { id: 'backwater', label: 'Backwater Explorer', desc: 'Kerala Houseboats', unlocked: checkBadge(['kerala-houseboats']), color: '#00B0FF' },
      { id: 'heritage', label: 'Heritage Hunter', desc: 'Hampi or Udaipur', unlocked: checkBadge(['hampi-ruins', 'udaipur-mewar']), color: '#C1573A' },
      { id: 'tea', label: 'Tea Valley Collector', desc: 'Munnar or Cherrapunji', unlocked: checkBadge(['munnar-tea', 'cherrapunji-roots']), color: '#004D40' },
    ];
  }, [checkedDestinationIds]);

  // Journey Score calculation (max 100 for basic MVP)
  const journeyScore = useMemo(() => {
    const score = (bookedTours.length * 25) + (savedItineraries.length * 15) + (wishlistTours.length * 5);
    return Math.min(score, 100) || 10; // Default baseline score
  }, [bookedTours, savedItineraries, wishlistTours]);

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto select-none bg-sand min-h-screen text-left">
      
      {/* ── PASSPORT DASHBOARD PANEL ── */}
      <div className="mb-10 p-6 bg-white border bg-cream rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-night flex items-center justify-center text-white shrink-0">
              <User className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[8px] font-mono text-gold uppercase tracking-[0.25em] block leading-none mb-1">
                Active Passport
              </span>
              <h2 className="font-display text-3xl font-light text-night lowercase leading-none">
                Citizen of India
              </h2>
            </div>
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-saffron leading-none">
                {journeyScore}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Journey Score</span>
            </div>
            <div className="px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-gold leading-none">
                {checkedDestinationIds.size}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Chapters</span>
            </div>
            <div className="px-4 py-2 bg-warm-white border bg-cream/60 rounded-2xl">
              <span className="text-[28px] font-display font-light text-night leading-none">
                {badgesList.filter(b => b.unlocked).length}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted/50 block mt-1">Badges</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-cream" />

        {/* Badges Gallery */}
        <div>
          <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 block mb-4 font-bold">
            unlocked travel badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {badgesList.map((badge) => (
              <div 
                key={badge.id}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  badge.unlocked 
                    ? 'bg-white bg-cream shadow-sm' 
                    : 'bg-warm-white/60 bg-cream/40 opacity-40'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5"
                  style={{ backgroundColor: badge.unlocked ? `${badge.color}15` : '#ECE6DA40', color: badge.unlocked ? badge.color : '#94A3B8' }}
                >
                  <Award className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-bold text-night leading-snug line-clamp-1">
                  {badge.label}
                </span>
                <span className="text-[8px] text-muted/50 font-light mt-0.5">
                  {badge.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab selectors */}
      <div className="flex justify-start mb-8">
        <div className="bg-white border bg-cream p-1.5 rounded-2xl flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-night text-white shadow-sm'
                : 'text-muted/60 hover:text-night'
            }`}
          >
            <span>Expeditions</span>
            {bookedTours.length > 0 && (
              <span className="h-4.5 min-w-4.5 rounded-full bg-gold text-[8px] font-bold text-white flex items-center justify-center px-1">
                {bookedTours.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`px-5 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'wishlist'
                ? 'bg-night text-white shadow-sm'
                : 'text-muted/60 hover:text-night'
            }`}
          >
            <span>Saved Stories</span>
            {wishlistTours.length > 0 && (
              <span className="h-4.5 min-w-4.5 rounded-full bg-gold text-[8px] font-bold text-white flex items-center justify-center px-1">
                {wishlistTours.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('itineraries')}
            className={`px-5 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'itineraries'
                ? 'bg-night text-white shadow-sm'
                : 'text-muted/60 hover:text-night'
            }`}
          >
            <span>Saved Journals</span>
            {savedItineraries.length > 0 && (
              <span className="h-4.5 min-w-4.5 rounded-full bg-gold text-[8px] font-bold text-white flex items-center justify-center px-1">
                {savedItineraries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Booked Expeditions Panel */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-6">
          {bookedTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookedTours.map((bt) => (
                <div 
                  key={bt.bookingCode}
                  className="bg-white rounded-[28px] border bg-cream shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 text-left">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex gap-4">
                        <img 
                          src={bt.bannerImage} 
                          alt={bt.tourTitle}
                          className="w-16 h-16 rounded-2xl object-cover border bg-cream bg-sand"
                        />
                        <div>
                          <span className="text-[8px] font-mono text-gold uppercase tracking-widest block mb-0.5">
                            Boarding Pass Voucher
                          </span>
                          <h3 className="font-display font-light text-xl leading-snug text-night line-clamp-1">
                            {bt.tourTitle}
                          </h3>
                          <p className="text-[9px] text-muted/60 mt-0.5 font-mono">TZ-{bt.bookingCode}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 bg-[#004D40]/10 text-[9px] font-bold text-[#004D40] rounded-full uppercase tracking-wider border border-[#004D40]/20">
                        Approved
                      </span>
                    </div>

                    {/* Voucher Specs */}
                    <div className="grid grid-cols-2 gap-3 bg-warm-white p-4 rounded-2xl border bg-cream/60 text-[10px]">
                      <div>
                        <p className="text-[8px] text-muted/50 uppercase font-bold tracking-wider">Departure Date</p>
                        <p className="font-bold text-night mt-0.5">{bt.date}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-muted/50 uppercase font-bold tracking-wider">Travelers</p>
                        <p className="font-bold text-night mt-0.5">{bt.guests} {bt.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                      <div className="mt-2.5">
                        <p className="text-[8px] text-muted/50 uppercase font-bold tracking-wider">Lead Passenger</p>
                        <p className="font-bold text-night uppercase mt-0.5 truncate max-w-[125px]">{bt.fullName}</p>
                      </div>
                      <div className="mt-2.5">
                        <p className="text-[8px] text-muted/50 uppercase font-bold tracking-wider">Total Charge</p>
                        <p className="font-bold text-saffron mt-0.5">₹{(bt.price * 83 * bt.guests).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-warm-white border-t bg-cream p-4 px-6 flex items-center justify-between">
                    <button
                      onClick={() => triggerMockPrint(bt.bookingCode)}
                      className="text-[10px] font-bold uppercase tracking-wider text-muted/60 hover:text-gold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-gold" />
                      <span>Print Pass PDF</span>
                    </button>

                    <button
                      onClick={() => onCancelExpedition(bt.bookingCode)}
                      className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border bg-cream rounded-3xl max-w-md mx-auto p-6 shadow-sm">
              <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-night">No Secured Expeditions</h3>
              <p className="text-xs text-muted/60 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                You haven't secured any private luxury retreats. View our catalog of options to book a pass.
              </p>
              <button
                onClick={onNavigateExplore}
                className="mt-6 px-6 py-2.5 bg-night text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-saffron transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Browse Tour Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Curated Wishlist Panel */}
      {activeSubTab === 'wishlist' && (
        <div>
          {wishlistTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {wishlistTours.map((tour) => (
                <ScrapbookPostcard
                  key={tour.id}
                  tour={tour}
                  onRemove={() => onRemoveWishlist(tour.id)}
                  onInspect={() => onTourSelect(tour)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border bg-cream rounded-3xl max-w-md mx-auto p-6 shadow-sm">
              <Heart className="w-12 h-12 text-muted/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-night">Wishlist Empty</h3>
              <p className="text-xs text-muted/60 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                As you navigate our directories, bookmark individual chapters to save them in this scrapbook ledger.
              </p>
              <button
                onClick={onNavigateExplore}
                className="mt-6 px-6 py-2.5 bg-night text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-saffron transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Browse Chapters</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Itineraries Panel (Saved Journals) */}
      {activeSubTab === 'itineraries' && (
        <div className="space-y-4">
          {savedItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItineraries.map((itin: any) => (
                <div 
                  key={itin.id}
                  onClick={() => onInspectItinerary && onInspectItinerary(itin)}
                  className="p-6 rounded-[28px] bg-white border bg-cream shadow-sm flex items-start justify-between cursor-pointer hover:border-gold/50 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Accent border highlight */}
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gold/30" />
                  
                  <div className="flex-1 min-w-0 pr-4 pl-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-gold group-hover:animate-pulse" />
                      <span className="text-[8px] font-mono text-gold uppercase tracking-widest font-bold">Saved Escape Journal</span>
                    </div>
                    <h3 className="font-display font-light text-2xl text-night group-hover:text-saffron transition-colors leading-tight">
                      {itin.title || 'Untitled Itinerary'}
                    </h3>
                    <div className="flex items-center gap-3.5 mt-2.5 text-[9px] text-muted/60 font-mono uppercase tracking-wider font-bold">
                      {itin.destination && (
                        <span className="flex items-center gap-1 bg-warm-white px-2.5 py-1 rounded-xl border bg-cream">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {itin.destination.split('-')[0]}
                        </span>
                      )}
                      {itin.duration && (
                        <span className="flex items-center gap-1 bg-warm-white px-2.5 py-1 rounded-xl border bg-cream">
                          <Clock className="w-3.5 h-3.5 text-sage" />
                          {itin.duration} Days
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteItinerary(itin.id); }}
                    className="w-8 h-8 rounded-full bg-warm-white flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 shrink-0 cursor-pointer border bg-cream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border bg-cream rounded-3xl max-w-md mx-auto p-6 shadow-sm">
              <Compass className="w-12 h-12 text-muted/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-night">No Saved Escape Journals</h3>
              <p className="text-xs text-muted/60 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                Use our guided Journey Builder to plan custom daily itineraries, then archive them in this scrapbook.
              </p>
              <button
                onClick={onNavigateExplore}
                className="mt-6 px-6 py-2.5 bg-night text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-saffron transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Browse Chapters</span>
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating printing simulator overlay */}
      {mockPrintCode && (
        <div className="fixed bottom-8 right-8 z-50 bg-night border border-white/10 text-white p-4.5 rounded-2xl shadow-elevated flex items-center gap-3.5 animate-slide-in-right">
          <div className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
          <div className="text-[10px]">
            <p className="font-bold">Printing Pass Voucher...</p>
            <p className="font-light text-white/60 mt-0.5">Processing code TZ-{mockPrintCode}</p>
          </div>
        </div>
      )}

    </div>
  );
}
