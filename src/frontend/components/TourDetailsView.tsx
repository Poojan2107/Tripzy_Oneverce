"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Tour } from '../types';
import { formatINR } from '../utils/currency';
import { trackEvent } from '../utils/analytics';
import { CULTURAL_CONTEXT, NEARBY_DAYTRIPS } from './tourDetails/data';
import TourHero from './tourDetails/TourHero';
import StatsBar from './tourDetails/StatsBar';
import StoryTab from './tourDetails/StoryTab';
import ItineraryTab from './tourDetails/ItineraryTab';
import LocalIntelTab from './tourDetails/LocalIntelTab';
import LogisticsTab from './tourDetails/LogisticsTab';
import HotelsTab from './tourDetails/HotelsTab';
import Sidebar from './tourDetails/Sidebar';
import Footer from './Footer';


interface TourDetailsViewProps {
  tour: Tour;
  onBack: () => void;
  onPlanClick: () => void;
  onToggleWishlist: (tourId: string) => void;
  isWishlisted: boolean;
}

const TABS = [
  { id: 'story', label: 'The Story' },
  { id: 'itinerary', label: 'Explorer Log' },
  { id: 'local', label: 'Local Secrets' },
  { id: 'logistics', label: 'Plan & Prepare' },
  { id: 'hotels', label: 'Where To Stay' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function TourDetailsView({ tour, onBack, onPlanClick, isWishlisted, onToggleWishlist }: TourDetailsViewProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('story');

  // Stays render instantly without artificial loading delay

  useEffect(() => {
    if (tour && tour.id) trackEvent('view', { destinationId: tour.dbId || tour.id });
  }, [tour]);

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cultural = CULTURAL_CONTEXT[tour.id];
  const dayTrips = NEARBY_DAYTRIPS[tour.id] || [];
  const accentColor = tour.accents?.primary || '#D6A85F';

  return (
    <div className="pb-32 bg-sand min-h-[100dvh] select-none">
      <TourHero tour={tour} onBack={onBack} onToggleWishlist={onToggleWishlist} isWishlisted={isWishlisted} tagline={cultural?.tagline} copiedLink={copiedLink} onShare={handleShare} />
      <StatsBar tour={tour} />

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-0">
            <div className="relative flex gap-1.5 overflow-x-auto no-scrollbar pb-4 border-b border-border/50 mb-8">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer border min-h-[40px] transition-all duration-200 ${activeTab === tab.id ? 'text-white border-transparent shadow-sm' : 'text-muted/70 bg-white border-border/50 hover:border-gold/50 hover:text-night'}`}>
                  {activeTab === tab.id && (
                    <motion.span layoutId="tourTabActive" className="absolute inset-0 bg-night rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'story' && (
                <motion.div key="story"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <StoryTab tour={tour} cultural={cultural} accentColor={accentColor} />
                </motion.div>
              )}
              {activeTab === 'itinerary' && (
                <motion.div key="itinerary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ItineraryTab tour={tour} activeDay={activeDay} onDayChange={setActiveDay} accentColor={accentColor} />
                </motion.div>
              )}
              {activeTab === 'local' && (
                <motion.div key="local"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {cultural ? (
                    <LocalIntelTab tour={tour} cultural={cultural} dayTrips={dayTrips} accentColor={accentColor} />
                  ) : (
                    <div className="py-16 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/40">Local intel coming soon for this chapter</span>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'logistics' && (
                <motion.div key="logistics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogisticsTab tour={tour} onPlanClick={onPlanClick} />
                </motion.div>
              )}
              {activeTab === 'hotels' && (
                <motion.div key="hotels"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <HotelsTab tour={tour} loadingHotels={false} onPlanClick={onPlanClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Sidebar tour={tour} cultural={cultural} onPlanClick={onPlanClick} />
        </div>
      </div>

      <Footer />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border shadow-elevated px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom,8px))] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-lg font-display font-bold text-night">{formatINR(tour.price)}</span>
          <span className="text-[10px] text-muted font-light ml-1">/ person</span>
        </div>
        <button onClick={onPlanClick} className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gold text-[#0B1720] text-[10px] font-bold uppercase tracking-wider hover:bg-gold/90 transition-all cursor-pointer min-h-[44px] min-w-[44px] border-none">
          <Sparkles className="w-3.5 h-3.5 text-[#0B1720]" />
          <span>Craft Journey</span>
        </button>
      </div>
    </div>
  );
}
