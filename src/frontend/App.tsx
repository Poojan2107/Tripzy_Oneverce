"use client";
import { useState, useEffect } from 'react';
import { Compass, Search, LogIn, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
import AiPlannerView from './components/AiPlannerView';
import TripsWishlistView from './components/TripsWishlistView';
import HomeView from './components/HomeView';

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
  const [wishlistIds, setWishlistIds] = useState<string[]>(['varanasi-spiritual', 'kerala-houseboats']);
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
      if (isClient) {
        localStorage.setItem('tripzy_wishlist', JSON.stringify(updated));
        trackWishlistSave(tourId, !exists);
      }
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
    <div className="w-full min-h-[100dvh] flex flex-col bg-transparent text-ink antialiased relative overflow-x-clip">
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

      {/* Mobile Top Header */}
      <header className={`md:hidden w-full sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between border-b select-none transition-all duration-300 ${
        currentTab === 'home' && selectedTour === null
          ? 'bg-sand/90 backdrop-blur-md border-warm-gray/25 text-night'
          : 'bg-[#081A24]/90 backdrop-blur-md border-white/5 text-white'
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
          <span className={`font-display text-lg font-bold tracking-tight lowercase ${
            currentTab === 'home' && selectedTour === null ? 'text-night' : 'text-white'
          }`}>
            tripzy<span className="text-gold">.ai</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className={`p-2 rounded-xl transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center ${
              currentTab === 'home' && selectedTour === null
                ? 'text-muted hover:text-night hover:bg-sand'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Sign In / Profile Info */}
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-6 h-6 rounded-full object-cover border border-warm-gray/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gold text-[#0B1720] flex items-center justify-center text-[10px] font-bold">
                  {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <button
                onClick={() => signOut()}
                className={`p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[32px] ${
                  currentTab === 'home' && selectedTour === null
                    ? 'text-muted hover:text-rose-500 hover:bg-rose-50'
                    : 'text-white/60 hover:text-rose-400 hover:bg-white/5'
                }`}
              >
                <LogOut className="w-3 h-3 inline mr-1" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[32px] ${
                currentTab === 'home' && selectedTour === null
                  ? 'bg-night text-white hover:bg-coral'
                  : 'bg-white text-night hover:bg-gold'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      <main className="w-full flex-grow">
        {selectedTour ? (
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
        visible={selectedTour === null}
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


    </div>
    </ErrorBoundary>
  );
}
