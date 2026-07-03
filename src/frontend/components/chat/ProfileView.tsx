"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, Heart, Award, MapPin, Calendar, Clock, ArrowLeft, Trash2, Compass,
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import type { Tour } from '../../types';
import SafeImage from '../ui/SafeImage';
import EmptyPassportState from '../passport/EmptyPassportState';

interface ProfileViewProps {
  wishlistTours: Tour[];
  savedItineraries: any[];
  onTourSelect: (tour: Tour) => void;
  onRemoveWishlist: (tourId: string) => void;
  onDeleteItinerary: (id: string) => void;
  allTours: Tour[];
  onBack?: () => void;
}

type ProfileTab = 'journeys' | 'wishlist' | 'stats';

function StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border/40 rounded-xl p-4 text-center">
      <p className="font-display text-section text-night font-light">{value}</p>
      <p className="text-micro text-muted/60 font-mono uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

export default function ProfileView({
  wishlistTours, savedItineraries, onTourSelect,
  onRemoveWishlist, onDeleteItinerary, allTours, onBack,
}: ProfileViewProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>('journeys');

  const totalDays = useMemo(() => {
    return savedItineraries.reduce((sum: number, itin: any) => {
      const days = itin.itinerary?.length || itin.duration || 0;
      return sum + (typeof days === 'number' ? days : parseInt(days) || 0);
    }, 0);
  }, [savedItineraries]);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/30 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary-surface text-muted cursor-pointer" aria-label="Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="font-display text-heading text-night font-light lowercase">explorer profile</h1>
            <p className="text-micro text-muted/50 font-mono">
              {session?.user?.name || 'Guest'} · {savedItineraries.length} journeys
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary-surface/60 rounded-xl border border-border/30 w-fit">
          {[
            { id: 'journeys' as ProfileTab, label: 'Saved Journeys', icon: Bookmark, count: savedItineraries.length },
            { id: 'wishlist' as ProfileTab, label: 'Wishlist', icon: Heart, count: wishlistTours.length },
            { id: 'stats' as ProfileTab, label: 'Stats & Profile', icon: Award, count: null },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? 'bg-surface text-night shadow-sm'
                  : 'text-muted/60 hover:text-night'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {count !== null && count > 0 && (
                <span className="text-micro px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-mono">{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'journeys' && (
              <>
                {savedItineraries.length === 0 ? (
                  <EmptyPassportState onNavigate={() => {}} type="itineraries" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedItineraries.map((itin: any) => {
                      const destName = itin.destinationId
                        ? allTours.find((t) => t.id === itin.destinationId)?.title || itin.destinationId
                        : itin.title || 'Saved Journey';
                      const dayCount = itin.itinerary?.length || itin.duration || '—';
                      return (
                        <div
                          key={itin.id}
                          className="group relative rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm hover:shadow-md transition-all duration-300 p-5 text-left card-lift"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                              <Compass className="w-4 h-4 text-teal" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-card text-night font-light lowercase leading-tight">{destName}</h3>
                              <div className="flex items-center gap-3 mt-1 text-micro text-muted/50">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {dayCount} days
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {new Date(itin.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteItinerary(itin.id)}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-muted hover:text-coral opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Delete journey"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'wishlist' && (
              <>
                {wishlistTours.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-8 h-8 text-muted/20 mx-auto mb-3" />
                    <p className="text-body text-muted/60 font-light">Your wishlist is empty</p>
                    <p className="text-caption text-muted/40 mt-1">Save destinations you love</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistTours.map((tour) => (
                      <button
                        key={tour.id}
                        onClick={() => onTourSelect(tour)}
                        className="group relative rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm hover:shadow-md transition-all duration-300 text-left cursor-pointer card-lift"
                      >
                        <div className="aspect-[3/2] relative overflow-hidden">
                          <SafeImage src={tour.bannerImage} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="text-card text-night font-semibold">{tour.title}</h3>
                          <div className="flex items-center gap-2 text-small text-muted/60">
                            <MapPin className="w-3 h-3" />
                            {tour.location}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveWishlist(tour.id); }}
                          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-coral opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <StatsCard label="Journeys Planned" value={String(savedItineraries.length)} />
                  <StatsCard label="Days Traveled" value={String(totalDays)} />
                  <StatsCard label="Wishlist" value={String(wishlistTours.length)} />
                </div>

                {/* Session Info */}
                <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-display text-card text-night font-light mb-4">Account</h3>
                  {session ? (
                    <div className="space-y-2 text-caption text-muted/70">
                      <p><span className="text-night font-semibold">Name:</span> {session.user?.name || '—'}</p>
                      <p><span className="text-night font-semibold">Email:</span> {session.user?.email || '—'}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-body text-muted/60 font-light mb-3">Sign in to sync your profile across devices</p>
                      <button
                        onClick={() => signIn()}
                        className="btn btn-primary px-6 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
