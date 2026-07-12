"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Search, LogIn, LogOut, ArrowUp, BookOpen, Menu, Sparkles } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { trackPageView, trackWishlistSave, trackDestinationClick } from './utils/analytics';
import { useToast } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';

import { TabType, Tour, Conversation } from './types';
import { TOURS_DATA, INDIA_CHAPTER_SLUGS } from './data';
import { getAllDestinations } from '../backend/actions/tourActions';

import GlassNavbar from './components/GlassNavbar';
import ExploreView from './components/ExploreView';
import TourDetailsView from './components/TourDetailsView';
import SearchModal from './components/SearchModal';
import HomeView from './components/HomeView';
import Sidebar from './components/chat/Sidebar';
import ChatView from './components/chat/ChatView';
import Footer from './components/Footer';

const AiPlannerView = dynamic(() => import('./components/AiPlannerView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-border/40 border-t-teal animate-spin" />
    </div>
  )
});
const TripsWishlistView = dynamic(() => import('./components/TripsWishlistView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-border/40 border-t-teal animate-spin" />
    </div>
  )
});

import { useAtmosphere } from './utils/AtmosphereContext';

export default function App() {
  const { setActiveLocation } = useAtmosphere();
  const { data: session } = useSession();
  const { toast } = useToast();

  const sortToursIndiaFirst = (list: Tour[]) => {
    const india = INDIA_CHAPTER_SLUGS.map(id => list.find(t => t.id === id)).filter(Boolean) as Tour[];
    const rest = list.filter(t => !INDIA_CHAPTER_SLUGS.includes(t.id));
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
  const [plannerPrompt, setPlannerPrompt] = useState<string | null>(null);

  // Chat conversation states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentTab]);

  useEffect(() => {
    if (isClient) {
      trackPageView(currentTab);
    }
  }, [currentTab, isClient]);

  useEffect(() => {
    setIsClient(true);
    try {
      // Legacy fallback check for maximum compatibility
      let savedWishlist = localStorage.getItem('tripzy_wishlist');
      if (!savedWishlist) {
        savedWishlist = localStorage.getItem('wishlist') || localStorage.getItem('travebie_wishlist');
        if (savedWishlist) {
          localStorage.setItem('tripzy_wishlist', savedWishlist);
        }
      }
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
      
      let savedItins = localStorage.getItem('tripzy_itineraries');
      if (!savedItins) {
        savedItins = localStorage.getItem('itineraries') || localStorage.getItem('travebie_itineraries');
        if (savedItins) {
          localStorage.setItem('tripzy_itineraries', savedItins);
        }
      }
      if (savedItins) setSavedItineraries(JSON.parse(savedItins));

      let savedConvs = localStorage.getItem('travebie_conversations');
      if (savedConvs) setConversations(JSON.parse(savedConvs));

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
            status: d.status || 'PUBLISHED',
          }));
          setTours(mapped);
        } else {
          setTours(TOURS_DATA);
          toast("Could not load destinations from database. Showing demo data.", "info");
        }
      } catch (err) {
        console.error("Failed to query database destinations:", err);
        setTours(TOURS_DATA);
        toast("Database connection failed. Showing demo data.", "error");
      } finally {
        setLoadingDestinations(false);
      }
    };
    loadDestinations();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'explore', 'ai-planner', 'saved', 'chat'].includes(hash)) {
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

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('travebie_conversations', JSON.stringify(conversations.slice(0, 50)));
    }
  }, [conversations, isClient]);

  const handleClearPendingPrompt = () => {
    setPendingPrompt(null);
  };

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

  const handleGoToPlannerWithPrompt = (prompt: string) => {
    setActiveConversationId(null);
    setPendingPrompt(prompt);
    setCurrentTab('chat');
    setSelectedTour(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.history.pushState(null, '', '#chat');
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
    <div className={`w-full flex flex-col bg-transparent text-night antialiased relative overflow-x-clip ${
      currentTab === 'chat' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'
    }`}>
      {currentTab !== 'chat' && (
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
      )}

      {/* Mobile Brand Bar */}
      {selectedTour === null && currentTab !== 'chat' && (
        <header className={`print:hidden md:hidden w-full z-50 px-4 py-2.5 flex items-center justify-between select-none transition-all duration-300 ${
          currentTab === 'home'
            ? 'absolute top-0 left-0 bg-transparent border-none'
            : 'sticky top-0 border-b bg-background/90 backdrop-blur-md border-border/40'
        }`}>
          <div className="flex items-center gap-2.5 min-h-[40px]">
            {/* Hamburger button (Mobile-only) */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`w-9.5 h-9.5 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                currentTab === 'home'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-border/30 bg-surface/90 hover:bg-secondary-surface text-night'
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Logo */}
            <button
              onClick={() => {
                setSelectedTour(null);
                setCurrentTab('home');
                window.scrollTo({ top: 0, behavior: 'instant' });
                window.history.pushState(null, '', '#home');
              }}
              className="flex items-center gap-1.5 btn-ghost cursor-pointer text-left shrink-0"
            >
              <Compass className="w-4.5 h-4.5 text-gold animate-spin-slow" />
              <span className={`font-logo text-base font-bold tracking-tight lowercase ${
                currentTab === 'home' ? 'text-white' : 'text-night'
              }`}>
                travebie<span className="text-gold">.ai</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Passport Button */}
            <button
              onClick={() => {
                setCurrentTab('saved');
                window.scrollTo({ top: 0, behavior: 'instant' });
                window.history.pushState(null, '', '#saved');
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-micro font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 ${
                currentTab === 'home'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-border/40 bg-surface/90 hover:bg-secondary-surface text-night'
              }`}
              aria-label="Passport"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal" />
              <span>Passport</span>
            </button>

            {/* Sign In / Sign Out Button */}
            {session ? (
              <button
                onClick={() => signOut()}
                className={`px-2.5 py-1.5 rounded-xl border text-micro font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 ${
                  currentTab === 'home'
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-border/40 bg-surface/90 hover:bg-secondary-surface text-night'
                }`}
              >
                <LogOut className="w-3.5 h-3.5 text-coral" />
                <span>Out</span>
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className={`px-2.5 py-1.5 rounded-xl border text-micro font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 ${
                  currentTab === 'home'
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-border/40 bg-surface/90 hover:bg-secondary-surface text-night'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-gold" />
                <span>In</span>
              </button>
            )}
          </div>
        </header>
      )}

      <main className={`w-full flex-grow ${currentTab === 'chat' ? 'h-full flex flex-col overflow-hidden' : ''}`}>
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
                      className="px-5 py-2.5 btn-night text-micro font-bold uppercase tracking-wider rounded-xl"
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
              className={currentTab === 'chat' ? 'h-full w-full flex flex-col overflow-hidden' : ''}
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
                  setActiveConversationId(null);
                  setCurrentTab('chat');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#chat');
                }}
                onGoToPassport={() => {
                  setCurrentTab('saved');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.history.pushState(null, '', '#saved');
                }}
                onGoToPlannerWithPrompt={handleGoToPlannerWithPrompt}
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
                initialPrompt={plannerPrompt}
                onClearInitialPrompt={() => setPlannerPrompt(null)}
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

            {currentTab === 'chat' && (
              <div className="w-full h-[100vh] max-h-[100vh] flex bg-background text-night antialiased relative overflow-hidden pt-0">
                {/* Sidebar */}
                <Sidebar
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  currentMode="chat"
                  wishlistCount={wishlistIds.length}
                  session={session}
                  onNewChat={() => { setActiveConversationId(null); }}
                  onSelectConversation={setActiveConversationId}
                  onDeleteConversation={(id) => setConversations((prev) => prev.filter((c) => c.id !== id))}
                  onShowProfile={() => {
                    setCurrentTab('saved');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    window.history.pushState(null, '', '#saved');
                  }}
                  onShowChat={() => {
                    setCurrentTab('chat');
                  }}
                  onSignIn={() => signIn()}
                  onSignOut={() => signOut()}
                  onBackToHome={() => {
                    setCurrentTab('home');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    window.history.pushState(null, '', '#home');
                  }}
                  mobileOpen={mobileSidebarOpen}
                  setMobileOpen={setMobileSidebarOpen}
                />

                {/* Chat Main Area */}
                <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
                  <ChatView
                    tours={displayTours}
                    wishlistIds={wishlistIds}
                    savedItineraries={savedItineraries}
                    onToggleWishlist={handleToggleWishlist}
                    onSaveItinerary={handleSaveItinerary}
                    onDeleteItinerary={handleDeleteItinerary}
                    onShowTourDetail={handleSelectTour}
                    externalConversations={conversations}
                    externalActiveId={activeConversationId}
                    onConversationsChange={setConversations}
                    onActiveConversationChange={setActiveConversationId}
                    pendingPrompt={pendingPrompt}
                    onClearPendingPrompt={handleClearPendingPrompt}
                    onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
                    session={session}
                    onSignIn={() => signIn()}
                    onSignOut={() => signOut()}
                    onShowPassport={() => {
                      setCurrentTab('saved');
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      window.history.pushState(null, '', '#saved');
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {(currentTab === 'home' || currentTab === 'saved') && !selectedTour && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}

      {/* BottomNavbar is removed on mobile/tablet to prioritize clean fullscreen space */}

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
            className="fixed bottom-[calc(var(--nav-bottom-height)-12px+var(--safe-bottom))] md:bottom-6 right-5 z-[100] w-10 h-10 flex items-center justify-center rounded-full btn-night shadow-lg"
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
