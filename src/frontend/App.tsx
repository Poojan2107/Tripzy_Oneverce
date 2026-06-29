"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Search, LogIn, LogOut, ArrowUp } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { trackPageView, trackWishlistSave, trackDestinationClick } from './utils/analytics';
import ErrorBoundary from './components/ErrorBoundary';

import { TabType, Tour } from './types';
import { TOURS_DATA } from './data';
import { getAllDestinations } from '../backend/actions/tourActions';

import GlassNavbar from './components/GlassNavbar';
import BottomNavbar from './components/BottomNavbar';
import ExploreView from './components/ExploreView';
import TourDetailsView from './components/TourDetailsView';
import SearchModal from './components/SearchModal';
import HomeView from './components/HomeView';

const AiPlannerView = dynamic(() => import('./components/AiPlannerView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-warm-gray/40 border-t-teal animate-spin" />
    </div>
  )
});
const TripsWishlistView = dynamic(() => import('./components/TripsWishlistView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-warm-gray/40 border-t-teal animate-spin" />
    </div>
  )
});

import { useAtmosphere } from './utils/AtmosphereContext';

export default function App() {
  const { setActiveLocation } = useAtmosphere();
  const { data: session } = useSession();

  // Sort: Indian destinations always surface first
  const INDIA_IDS = ['varanasi-spiritual','udaipur-mewar','kerala-houseboats','ladakh-passes','jaisalmer-fort','goa-beach','hampi-ruins','kashmir-meadows','munnar-tea','kutch-salt','cherrapunji-roots','andaman-reefs'];
  const sortToursIndiaFirst = (list: Tour[]) => {
    const india = INDIA_IDS.map(id => list.find(t => t.id === id)).filter(Boolean) as Tour[];
    const rest = list.filter(t => !INDIA_IDS.includes(t.id));
    return [...india, ...rest];
  };

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadedItinerary, setLoadedItinerary] = useState<any | null>(null);

  useEffect(() => {
    if (isClient) {
      trackPageView(currentTab);
    }
  }, [currentTab, isClient]);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedWishlist = localStorage.getItem('tripzy_wishlist');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
      
      const savedItins = localStorage.getItem('tripzy_itineraries');
      if (savedItins) setSavedItineraries(JSON.parse(savedItins));

    } catch (e) {
      console.error("Failed to parse local storage", e);
    }

    const loadDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const res = await getAllDestinations();
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((d: any) => ({
            id: d.slug || d.id,
            dbId: d.id,
            title: d.name,
            subtitle: d.metadata?.subtitle || d.description.slice(0, 85) + '...',
            description: d.description,
            category: (d.trending ? 'trending' : d.featured ? 'popular' : 'international') as 'trending' | 'popular' | 'weekend' | 'international',
            duration: d.duration || '5 Days',
            rating: d.price ? 4.8 + (d.price % 3) * 0.05 : 4.9,
            reviewsCount: d.reviews?.length || 0,
            price: d.price || 1500,
            location: `${d.city}, ${d.country}`,
            groupSize: d.groupSize || 'Max 6 travelers',
            difficulty: d.difficulty || 'Easy',
            bannerImage: d.images?.[0] || '/images/tours/varanasi-banner.jpg',
            images: d.images || [],
            itinerary: d.metadata?.itinerary || [],
            includedServices: d.metadata?.includedServices || [],
            reviews: d.reviews || [],
            tags: d.tags || [],
            moods: d.moods || [],
            activities: d.activities || [],
            bestSeason: d.bestSeason || undefined,
            latitude: d.latitude,
            longitude: d.longitude,
            chapterName: d.metadata?.chapterName,
            chapterTitle: d.metadata?.chapterTitle,
            storyHeadline: d.metadata?.storyHeadline,
            storyNarrative: d.metadata?.storyNarrative,
            localSecret: d.metadata?.localSecret,
            photographySpot: d.metadata?.photographySpot,
            signatureExperience: d.metadata?.signatureExperience,
            budgetRange: d.metadata?.budgetRange,
            accents: d.metadata?.accents || TOURS_DATA.find(t => t.id === (d.slug || d.id))?.accents,
          }));
          setTours(mapped);
        } else {
          setTours(TOURS_DATA);
        }
      } catch (err) {
        console.error("Failed to query database destinations:", err);
        setTours(TOURS_DATA);
      } finally {
        setLoadingDestinations(false);
      }
    };
    loadDestinations();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'explore', 'ai-planner', 'saved'].includes(hash)) {
      setCurrentTab(hash as TabType);
    }
  }, []);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tripzy_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tripzy_itineraries', JSON.stringify(savedItineraries));
    }
  }, [savedItineraries, isClient]);

  const displayTours = useMemo(
    () => sortToursIndiaFirst(isClient && tours.length > 0 ? tours : TOURS_DATA),
    [tours, isClient]
  );

  useEffect(() => {
    if (isClient && tours.length > 0) {
      localStorage.setItem('tripzy_tours', JSON.stringify(tours));
    }
  }, [tours, isClient]);

  const handleToggleWishlist = (tourId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(tourId);
      const updated = exists ? prev.filter((id) => id !== tourId) : [...prev, tourId];
      if (isClient) {
        localStorage.setItem('tripzy_wishlist', JSON.stringify(updated));
        trackWishlistSave(tourId, !exists);
      }
      return updated;
    });
  };

  const handleSaveItinerary = (newItin: any, skipRedirect = false) => {
    setSavedItineraries((prev) => {
      const exists = prev.some((i) => i.id === newItin.id);
      if (exists) return prev;
      const updated = [newItin, ...prev];
      if (isClient) localStorage.setItem('tripzy_itineraries', JSON.stringify(updated));
      return updated;
    });
    if (!skipRedirect) {
      setCurrentTab('saved');
    }
  };

  const handleDeleteItinerary = (itinId: string) => {
    setSavedItineraries((prev) => {
      const updated = prev.filter((i) => i.id !== itinId);
      if (isClient) localStorage.setItem('tripzy_itineraries', JSON.stringify(updated));
      return updated;
    });
  };

  const handleQuickCategoryClick = (categoryTag: string) => {
    setExploreCategoryFilter(categoryTag);
    setCurrentTab('explore');
    setSelectedTour(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.history.pushState(null, '', '#explore');
  };

  const handleSelectTour = (tour: Tour | null) => {
    setSelectedTour(tour);
    if (tour) {
      setActiveLocation(tour.location);
      trackDestinationClick(tour.id, tour.title);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const wishlistTours = useMemo(
    () => displayTours.filter((tour) => wishlistIds.includes(tour.id)),
    [displayTours, wishlistIds]
  );
  const featuredTours = useMemo(
    () => displayTours.filter(t => t.category === 'trending' || t.category === 'popular').slice(0, 4),
    [displayTours]
  );

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  return (
    <ErrorBoundary>
    <div className="w-full min-h-[100dvh] flex flex-col bg-transparent text-ink antialiased relative overflow-x-clip">
      <div className="print:hidden">
        <GlassNavbar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab !== 'ai-planner') {
              setLoadedItinerary(null);
            }
            setCurrentTab(tab);
            handleSelectTour(null);
            window.scrollTo({ top: 0, behavior: 'instant' });
            window.history.pushState(null, '', `#${tab}`);
          }}
          onSearchClick={() => setSearchModalOpen(true)}
          wishlistCount={wishlistIds.length}
        />
      </div>

      {/* Mobile Brand Bar — logo only, no duplicate auth/nav */}
      <header className={`print:hidden md:hidden w-full z-50 px-4 py-2.5 flex items-center justify-between select-none transition-all duration-300 ${
        currentTab === 'home' && selectedTour === null
          ? 'absolute top-0 left-0 bg-transparent border-none'
          : 'sticky top-0 border-b bg-[#081A24]/90 backdrop-blur-md border-white/5'
      }`}>
        <button
          onClick={() => {
            setSelectedTour(null);
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'instant' });
            window.history.pushState(null, '', '#home');
          }}
          className="flex items-center gap-2 border-none bg-transparent cursor-pointer text-left min-h-[40px]"
        >
          <Compass className="w-5 h-5 text-gold animate-spin-slow" />
          <span className="font-display text-lg font-bold tracking-tight lowercase text-white">
            travebie<span className="text-gold">.ai</span>
          </span>
        </button>
      </header>

      <main className="w-full flex-grow">
        <AnimatePresence mode="wait">
          {selectedTour ? (
            <motion.div key="tour-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ErrorBoundary
                onError={() => handleSelectTour(null)}
                fallback={
                  <div className="w-full min-h-[60dvh] flex flex-col items-center justify-center p-6">
                    <Compass className="w-10 h-10 text-gold mb-3" />
                    <h2 className="font-display text-xl text-night font-light lowercase mb-1">could not load chapter</h2>
                    <p className="text-xs text-muted/60 font-light mb-4">This destination details are temporarily unavailable.</p>
                    <button
                      onClick={() => handleSelectTour(null)}
                      className="px-5 py-2.5 bg-night text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
                    >
                      Back to Explore
                    </button>
                  </div>
                }
              >
              <TourDetailsView
                tour={selectedTour}
                onBack={() => handleSelectTour(null)}
                onPlanClick={() => {
                  setCurrentTab('ai-planner');
                  handleSelectTour(null);
                }}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.includes(selectedTour.id)}
              />
              </ErrorBoundary>
            </motion.div>
          ) : (
            <motion.div key={currentTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {currentTab === 'home' && (
              <HomeView
                tours={displayTours}
                wishlistIds={wishlistIds}
                loadingDestinations={loadingDestinations}
                onSearchClick={() => setSearchModalOpen(true)}
                onQuickCategoryClick={handleQuickCategoryClick}
                onSelectTour={handleSelectTour}
                onToggleWishlist={handleToggleWishlist}
                onGoToExplore={() => {
                  setExploreCategoryFilter('all');
                  setCurrentTab('explore');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#explore');
                }}
                onGoToPlanner={() => {
                  setCurrentTab('ai-planner');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#ai-planner');
                }}
              />
            )}

            {currentTab === 'explore' && (
              <ExploreView
                tours={displayTours}
                onTourSelect={handleSelectTour}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                initialCategoryFilter={exploreCategoryFilter}
                loading={loadingDestinations}
              />
            )}

            {currentTab === 'ai-planner' && (
              <AiPlannerView
                onSaveItinerary={handleSaveItinerary}
                loadedItinerary={loadedItinerary}
                onClearLoadedItinerary={() => setLoadedItinerary(null)}
                allTours={tours}
              />
            )}

            {currentTab === 'saved' && (
              <TripsWishlistView
                wishlistTours={wishlistTours}
                savedItineraries={savedItineraries}
                onTourSelect={handleSelectTour}
                onRemoveWishlist={handleToggleWishlist}
                onNavigateExplore={() => {
                  setExploreCategoryFilter('all');
                  setCurrentTab('explore');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#explore');
                }}
                onNavigatePlanner={() => {
                  setCurrentTab('ai-planner');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#ai-planner');
                }}
                onDeleteItinerary={handleDeleteItinerary}
                onInspectItinerary={(itin) => {
                  setLoadedItinerary(itin);
                  setCurrentTab('ai-planner');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#ai-planner');
                }}
                allTours={tours}
              />
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      <div className="print:hidden">
        <BottomNavbar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab !== 'ai-planner') {
              setLoadedItinerary(null);
            }
            setCurrentTab(tab);
            handleSelectTour(null);
            window.scrollTo({ top: 0, behavior: 'instant' });
            window.history.pushState(null, '', `#${tab}`);
          }}
          wishlistCount={wishlistIds.length}
          visible={selectedTour === null}
        />
      </div>

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tours={displayTours}
        onSelectTour={(tour) => {
          handleSelectTour(tour);
          setSearchModalOpen(false);
        }}
      />

      {/* Scroll-to-top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-[calc(var(--nav-bottom-height)-12px+env(safe-area-inset-bottom,12px))] md:bottom-6 right-5 z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-night text-white shadow-lg hover:bg-gold hover:text-night transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
    </ErrorBoundary>
  );
}
