import { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Clock, MapPin, Heart, Share2,
  Sparkles, Utensils, Plane, Home, Compass, User, Calendar, CheckCircle2, X
} from 'lucide-react';
import { Tour } from '../types';
import { formatINR } from '../utils/currency';

interface TourDetailsViewProps {
  tour: Tour;
  onBack: () => void;
  onPlanClick: () => void;
  onToggleWishlist: (tourId: string) => void;
  isWishlisted: boolean;
  onBookTour?: (bookingDetails: {
    tourId: string;
    tourTitle: string;
    bannerImage: string;
    price: number;
    guests: number;
    date: string;
    fullName: string;
    email: string;
    specialRequests?: string;
  }) => void;
}

function ServiceIcon({ iconName }: { iconName: string }) {
  const cn = "w-5 h-5 text-ocean";
  switch (iconName) {
    case 'Utensils': return <Utensils className={cn} />;
    case 'Plane': return <Plane className={cn} />;
    case 'Home': return <Home className={cn} />;
    default: return <Compass className={cn} />;
  }
}

export default function TourDetailsView({
  tour,
  onBack,
  onPlanClick,
  isWishlisted,
  onToggleWishlist,
  onBookTour
}: TourDetailsViewProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Booking Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (tour && tour.id) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'view',
          payload: { destinationId: tour.dbId || tour.id }
        })
      }).catch(() => {});
    }
  }, [tour]);

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href).catch((err) => {
      console.warn("Clipboard copy failed (non-HTTPS or iOS):", err);
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDate) return;

    if (onBookTour) {
      onBookTour({
        tourId: tour.id,
        tourTitle: tour.title,
        bannerImage: tour.bannerImage,
        price: tour.price,
        guests: bookingGuests,
        date: bookingDate,
        fullName: bookingName,
        email: bookingEmail,
        specialRequests
      });
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingOpen(false);
      // reset form
      setBookingName('');
      setBookingEmail('');
      setBookingDate('');
      setBookingGuests(2);
      setSpecialRequests('');
    }, 2500);
  };

  return (
    <div className="pb-32 bg-sand min-h-screen select-none">

      {/* ── EDITORIAL HERO ── */}
      <div className="relative w-full h-[40vh] md:h-[55vh] min-h-[280px] md:min-h-[400px] overflow-hidden">
        <img
          src={tour.bannerImage}
          alt={tour.title}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.opacity = '0' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/25 transition-all cursor-pointer z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Wishlist + Share */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleWishlist(tour.id)}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-gold/90 text-[10px] font-bold text-white uppercase tracking-wider">96% Match</span>
            {tour.moods?.slice(0, 2).map(m => (
              <span key={m} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wider">{m}</span>
            ))}
          </div>
          <h1
            className="font-display text-white lowercase font-light tracking-[-0.03em] leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: '0.88' }}
          >
            {tour.title}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-gold" /> {tour.location}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest">{tour.duration}</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-white/60">
              <Star className="w-3 h-3 fill-gold text-gold" />
              {tour.rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            

            {/* Title & Metadata */}
            <div>
              <h2 className="font-display text-2.5xl md:text-3xl text-night font-light lowercase leading-tight">{tour.subtitle}</h2>
              
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-bold text-muted uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ocean" />
                  {tour.location}
                </span>
                <span className="text-warm-gray">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sage" />
                  {tour.duration}
                </span>
                <span className="text-warm-gray">·</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-ocean" />
                  {tour.groupSize}
                </span>
              </div>
              {tour.bestSeason && (
                <p className="text-[10px] font-bold text-sage uppercase tracking-wider mt-3">
                  Best Season: {tour.bestSeason}
                </p>
              )}
            </div>

            {/* Mood Tags */}
            {tour.moods && tour.moods.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tour.moods.map((m) => (
                  <span key={m} className="px-3.5 py-1 rounded-full bg-cream text-night border border-warm-gray text-[10px] font-bold uppercase tracking-wider">
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="border-t border-warm-gray/50 pt-6">
              <h2 className="font-display text-2xl text-night font-bold mb-3">About This Chapter</h2>
              <p className="text-sm text-muted font-light leading-relaxed">{tour.description}</p>
            </div>

            {/* PRD: Chapter Lore */}
            {(tour.storyHeadline || tour.storyNarrative || tour.localSecret || tour.photographySpot || tour.signatureExperience) && (
              <div className="border-t border-warm-gray/50 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  {tour.chapterName && (
                    <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold uppercase tracking-widest">
                      {tour.chapterName}
                    </span>
                  )}
                  {tour.chapterTitle && (
                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{tour.chapterTitle}</span>
                  )}
                </div>
                <h2 className="font-display text-2xl text-night font-bold mb-4 leading-tight">
                  {tour.storyHeadline || 'Chapter Lore'}
                </h2>
                {tour.storyNarrative && (
                  <p className="text-sm text-muted font-light leading-relaxed italic border-l-2 border-gold/30 pl-4 mb-5">
                    "{tour.storyNarrative}"
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.localSecret && (
                    <div className="p-3.5 rounded-xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-saffron uppercase tracking-widest font-bold block mb-1">Local Secret</span>
                      <p className="text-[11px] text-night/70 font-light leading-relaxed">{tour.localSecret}</p>
                    </div>
                  )}
                  {tour.photographySpot && (
                    <div className="p-3.5 rounded-xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-gold uppercase tracking-widest font-bold block mb-1">Photography Spot</span>
                      <p className="text-[11px] text-night/70 font-light leading-relaxed">{tour.photographySpot}</p>
                    </div>
                  )}
                  {tour.signatureExperience && (
                    <div className="p-3.5 rounded-xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-sage uppercase tracking-widest font-bold block mb-1">Signature Experience</span>
                      <p className="text-[11px] text-night/70 font-light leading-relaxed">{tour.signatureExperience}</p>
                    </div>
                  )}
                  {tour.budgetRange && (
                    <div className="p-3.5 rounded-xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-ocean uppercase tracking-widest font-bold block mb-1">Budget Range</span>
                      <p className="text-[11px] text-night/70 font-light leading-relaxed">{tour.budgetRange}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div className="border-t border-warm-gray/50 pt-6">
              <h2 className="font-display text-2xl text-night font-bold mb-4">Daily Itinerary</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {tour.itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                      activeDay === day.day
                        ? 'bg-night text-white border-night'
                        : 'bg-white text-muted border-warm-gray hover:border-ocean/30'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
              {tour.itinerary.filter(d => d.day === activeDay).map((day) => (
                <div key={day.day} className="mt-4 p-5 rounded-2xl bg-white border border-warm-gray shadow-card animate-scale-in">
                  <h3 className="font-bold text-sm text-night">{day.title}</h3>
                  <p className="text-xs text-muted font-light mt-1.5 leading-relaxed">{day.description}</p>
                  {day.activities.length > 0 && (
                    <ul className="mt-3.5 space-y-1.5 border-t border-warm-gray/30 pt-3.5">
                      {day.activities.map((a, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-muted font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Included Services */}
            <div className="border-t border-warm-gray/50 pt-6">
              <h2 className="font-display text-2xl text-night font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.includedServices.map((s, i) => (
                  <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-warm-gray">
                    <ServiceIcon iconName={s.iconName} />
                    <span className="text-xs text-night font-semibold">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="max-lg:static lg:sticky lg:top-24 space-y-4">
              
              {/* Booking Actions Card */}
              <div className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card text-center">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-bold text-sm text-night">{tour.rating}</span>
                    <span className="text-xs text-muted font-light">({tour.reviewsCount} reviews)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sand border border-warm-gray text-night">
                    {tour.difficulty}
                  </span>
                </div>

                <div className="py-4 border-y border-warm-gray/40 mb-6">
                  <span className="text-3xl font-display font-bold text-night">{formatINR(tour.price)}</span>
                  <span className="text-xs text-muted font-light ml-1">/ person daily</span>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full py-3 rounded-xl bg-night hover:bg-night/95 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    Reserve Your Journey
                  </button>
                  <button
                    onClick={onPlanClick}
                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-warm-gray text-xs font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-sand/40 transition-all cursor-pointer bg-white"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ocean" />
                    <span>Start Planning</span>
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              {tour.reviews.length > 0 && (
                <div className="p-5 rounded-3xl bg-white border border-warm-gray shadow-card">
                  <h3 className="font-bold text-xs text-night uppercase tracking-wider mb-4 border-b border-warm-gray/40 pb-2">Traveler Notes</h3>
                  <div className="space-y-4">
                    {tour.reviews.slice(0, 2).map((r) => (
                      <div key={r.id} className="space-y-1.5 pb-3 border-b border-warm-gray/20 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={r.avatar} alt={r.author} className="w-7 h-7 rounded-full object-cover border border-warm-gray" onError={e => { e.currentTarget.style.opacity = '0' }} />
                          <div>
                            <p className="text-xs font-bold text-night">{r.author}</p>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                              <span className="text-[9px] font-bold text-muted">{r.rating}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Booking Form Dialog Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div onClick={() => setIsBookingOpen(false)} className="absolute inset-0 bg-night/35 backdrop-blur-[2px] cursor-pointer" />
          
          {/* Modal box */}
          <div className="relative w-full max-w-md bg-white border border-warm-gray shadow-elevated rounded-3xl p-6 overflow-hidden animate-scale-in z-10 text-left">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-sand/60 flex items-center justify-center text-muted hover:text-night transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-sage" />
                </div>
                <h3 className="font-display text-2xl font-bold text-night">Booking Confirmed</h3>
                <p className="text-xs text-muted font-light max-w-xs mx-auto leading-relaxed">
                  Your booking has been noted. Review it in your Passport.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-saffron uppercase tracking-widest block mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" /> Simulated Booking Demo
                  </span>
                  <h3 className="font-display text-2xl font-bold text-night">Book This Journey</h3>
                  <p className="text-[11px] text-muted font-light mt-0.5">Demo booking flow — no payment is processed.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-gray text-xs text-night placeholder:text-stone outline-none focus:border-ocean/40"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="jane.doe@travel.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-gray text-xs text-night placeholder:text-stone outline-none focus:border-ocean/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Departure Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-warm-gray text-xs text-night outline-none focus:border-ocean/40"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Guests Count</label>
                      <select
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-warm-gray text-xs text-night bg-white outline-none focus:border-ocean/40"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Special Requests (Optional)</label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Dietary preferences, private driver request..."
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-gray text-xs text-night placeholder:text-stone outline-none focus:border-ocean/40 h-14 resize-none"
                    />
                  </div>

                  <div className="border-t border-warm-gray/45 pt-3.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-night block mb-1">Booking Summary</label>
                    <div className="w-full px-3.5 py-3 rounded-xl border border-warm-gray bg-sand/35 flex items-center justify-between text-xs text-ink/80 font-mono relative">
                      <span className="text-muted italic">Demo — payment not processed</span>
                      <span className="text-[8px] font-sans font-bold uppercase text-sage flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage" /> SIMULATION
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-3 rounded-xl bg-night hover:bg-night/95 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
