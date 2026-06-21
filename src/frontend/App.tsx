"use client";
import { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

import { TabType, Tour } from './types';
import { TOURS_DATA } from './data';
import { getAllDestinations } from '../backend/actions/tourActions';

import GlassNavbar from './components/GlassNavbar';
import BottomNavbar from './components/BottomNavbar';
import ExploreView from './components/ExploreView';
import TourDetailsView from './components/TourDetailsView';
import SearchModal from './components/SearchModal';
import AiPlannerView from './components/AiPlannerView';
import TripsWishlistView from './components/TripsWishlistView';
import HomeView from './components/HomeView';
import { useAtmosphere } from './utils/AtmosphereContext';

export default function App() {
  const { setActiveLocation } = useAtmosphere();

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
  const [wishlistIds, setWishlistIds] = useState<string[]>(['varanasi-spiritual', 'kerala-houseboats']);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [bookedTours, setBookedTours] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadedItinerary, setLoadedItinerary] = useState<any | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedWishlist = localStorage.getItem('tripzy_wishlist');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
      
      const savedItins = localStorage.getItem('tripzy_itineraries');
      if (savedItins) setSavedItineraries(JSON.parse(savedItins));

      const savedBookings = localStorage.getItem('tripzy_bookings');
      if (savedBookings) setBookedTours(JSON.parse(savedBookings));
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

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tripzy_bookings', JSON.stringify(bookedTours));
    }
  }, [bookedTours, isClient]);

  const displayTours = sortToursIndiaFirst(isClient && tours.length > 0 ? tours : TOURS_DATA);

  useEffect(() => {
    if (isClient && tours.length > 0) {
      localStorage.setItem('tripzy_tours', JSON.stringify(tours));
    }
  }, [tours, isClient]);

  const handleToggleWishlist = (tourId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(tourId);
      const updated = exists ? prev.filter((id) => id !== tourId) : [...prev, tourId];
      if (isClient) localStorage.setItem('tripzy_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveItinerary = (newItin: any) => {
    setSavedItineraries((prev) => {
      const exists = prev.some((i) => i.id === newItin.id);
      if (exists) return prev;
      const updated = [newItin, ...prev];
      if (isClient) localStorage.setItem('tripzy_itineraries', JSON.stringify(updated));
      return updated;
    });
    setCurrentTab('saved');
  };

  const handleDeleteItinerary = (itinId: string) => {
    setSavedItineraries((prev) => {
      const updated = prev.filter((i) => i.id !== itinId);
      if (isClient) localStorage.setItem('tripzy_itineraries', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCancelBooking = (bookingCode: string) => {
    setBookedTours((prev) => prev.filter((b) => b.bookingCode !== bookingCode));
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
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const wishlistTours = displayTours.filter((tour) => wishlistIds.includes(tour.id));
  const featuredTours = displayTours.filter(t => t.category === 'trending' || t.category === 'popular').slice(0, 4);

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
    <div className="w-full min-h-screen flex flex-col bg-transparent text-ink antialiased relative overflow-x-clip">
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

      <main className="w-full flex-grow">
        {selectedTour ? (
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
        ) : (
          <>
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
                bookedTours={bookedTours}
                savedItineraries={savedItineraries}
                onTourSelect={handleSelectTour}
                onRemoveWishlist={handleToggleWishlist}
                onCancelExpedition={handleCancelBooking}
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
          </>
        )}
      </main>

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
        visible={true}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tours={displayTours}
        onSelectTour={(tour) => {
          handleSelectTour(tour);
          setSearchModalOpen(false);
        }}
      />

      <footer className="bg-night border-t border-warm-gray/30 py-12 px-6 text-center text-[10px] text-white/50 font-sans font-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 Tripzy. AI-powered travel discovery journal.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors cursor-pointer">Privacy</a>
            <span className="text-white/20">·</span>
            <a href="/terms" className="hover:text-white transition-colors cursor-pointer">Terms</a>
            <span className="text-white/20">·</span>
            <a href="/contact" className="hover:text-white transition-colors cursor-pointer">Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
