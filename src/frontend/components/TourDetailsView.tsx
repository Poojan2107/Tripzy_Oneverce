import { useState, useEffect } from 'react';
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

interface TourDetailsViewProps {
  tour: Tour;
  onBack: () => void;
  onPlanClick: () => void;
  onToggleWishlist: (tourId: string) => void;
  isWishlisted: boolean;
}

const TABS = [
  { id: 'story', label: 'The Story' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'local', label: 'Local Intel' },
  { id: 'logistics', label: 'Plan & Book' },
  { id: 'hotels', label: 'Hotels' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function TourDetailsView({ tour, onBack, onPlanClick, isWishlisted, onToggleWishlist }: TourDetailsViewProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('story');
  const [loadingHotels, setLoadingHotels] = useState(false);

  useEffect(() => {
    if (activeTab === 'hotels') {
      setLoadingHotels(true);
      const timer = setTimeout(() => setLoadingHotels(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

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
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-4 border-b border-warm-gray mb-8">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer border min-h-[44px] ${activeTab === tab.id ? 'bg-night text-white border-night' : 'bg-white text-muted border-warm-gray hover:border-gold'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'story' && <StoryTab tour={tour} cultural={cultural} accentColor={accentColor} />}
            {activeTab === 'itinerary' && <ItineraryTab tour={tour} activeDay={activeDay} onDayChange={setActiveDay} accentColor={accentColor} />}
            {activeTab === 'local' && cultural && <LocalIntelTab tour={tour} cultural={cultural} dayTrips={dayTrips} accentColor={accentColor} />}
            {activeTab === 'logistics' && <LogisticsTab tour={tour} onPlanClick={onPlanClick} />}
            {activeTab === 'hotels' && <HotelsTab tour={tour} loadingHotels={loadingHotels} onPlanClick={onPlanClick} />}
          </div>

          <Sidebar tour={tour} cultural={cultural} onPlanClick={onPlanClick} />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-warm-gray shadow-elevated px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom,8px))] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-lg font-display font-bold text-night">{formatINR(tour.price)}</span>
          <span className="text-[10px] text-muted font-light ml-1">/ person</span>
        </div>
        <button onClick={onPlanClick} className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gold text-[#0B1720] text-[10px] font-bold uppercase tracking-wider hover:bg-gold/90 transition-all cursor-pointer min-h-[44px] min-w-[44px] border-none">
          <Sparkles className="w-3.5 h-3.5 text-[#0B1720]" />
          <span>AI Plan</span>
        </button>
      </div>
    </div>
  );
}
