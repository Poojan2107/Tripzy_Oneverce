"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Tour, Conversation } from './types';
import { TOURS_DATA, INDIA_CHAPTER_SLUGS } from './data';
import { getAllDestinations } from '../backend/actions/tourActions';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/chat/Sidebar';
import ChatView from './components/chat/ChatView';
import ProfileView from './components/chat/ProfileView';
import TourDetailsView from './components/TourDetailsView';
import { useAtmosphere } from './utils/AtmosphereContext';
import { trackWishlistSave } from './utils/analytics';

export default function App() {
  const { setActiveLocation } = useAtmosphere();
  const { data: session } = useSession();

  const [mode, setMode] = useState<'chat' | 'profile'>('chat');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  // Conversations state (shared between Sidebar + ChatView)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const sortToursIndiaFirst = (list: Tour[]) => {
    const india = INDIA_CHAPTER_SLUGS.map(id => list.find(t => t.id === id)).filter(Boolean) as Tour[];
    const rest = list.filter(t => !INDIA_CHAPTER_SLUGS.includes(t.id));
    return [...india, ...rest];
  };

  useEffect(() => {
    setIsClient(true);
    try {
      const savedWishlist = localStorage.getItem('travebie_wishlist') || localStorage.getItem('tripzy_wishlist');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));

      const savedItins = localStorage.getItem('travebie_itineraries') || localStorage.getItem('tripzy_itineraries');
      if (savedItins) setSavedItineraries(JSON.parse(savedItins));

      const savedConvs = localStorage.getItem('travebie_conversations');
      if (savedConvs) setConversations(JSON.parse(savedConvs));
    } catch {}

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
            accents: d.metadata?.accents || TOURS_DATA.find((t: Tour) => t.id === (d.slug || d.id))?.accents,
            status: d.status || 'PUBLISHED',
          }));
          setTours(mapped);
        } else {
          setTours(TOURS_DATA);
        }
      } catch {
        setTours(TOURS_DATA);
      } finally {
        setLoadingDestinations(false);
      }
    };
    loadDestinations();
  }, []);

  // Persist wishlist
  useEffect(() => {
    if (isClient) localStorage.setItem('travebie_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds, isClient]);

  // Persist itineraries
  useEffect(() => {
    if (isClient) localStorage.setItem('travebie_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries, isClient]);

  // Persist conversations
  useEffect(() => {
    if (isClient && conversations.length > 0) {
      localStorage.setItem('travebie_conversations', JSON.stringify(conversations.slice(0, 50)));
    }
  }, [conversations, isClient]);

  const displayTours = useMemo(
    () => sortToursIndiaFirst(isClient && tours.length > 0 ? tours : TOURS_DATA),
    [tours, isClient]
  );

  const handleToggleWishlist = useCallback((tourId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(tourId);
      const updated = exists ? prev.filter((id) => id !== tourId) : [...prev, tourId];
      trackWishlistSave(tourId, !exists);
      return updated;
    });
  }, []);

  const handleSaveItinerary = useCallback((newItin: any, _skipRedirect = false) => {
    setSavedItineraries((prev) => {
      if (prev.some((i) => i.id === newItin.id)) return prev;
      return [newItin, ...prev];
    });
  }, []);

  const handleDeleteItinerary = useCallback((itinId: string) => {
    setSavedItineraries((prev) => prev.filter((i) => i.id !== itinId));
  }, []);

  // Clear pendingPrompt after ChatView consumes it
  useEffect(() => {
    if (pendingPrompt) {
      const t = setTimeout(() => setPendingPrompt(null), 100);
      return () => clearTimeout(t);
    }
  }, [pendingPrompt]);

  const handleShowProfile = useCallback(() => setMode('profile'), []);
  const handleShowChat = useCallback(() => setMode('chat'), []);

  const wishlistTours = useMemo(
    () => displayTours.filter((tour) => wishlistIds.includes(tour.id)),
    [displayTours, wishlistIds]
  );

  return (
    <ErrorBoundary>
      <div className="w-full min-h-[100dvh] flex bg-background text-night antialiased relative overflow-x-clip">

        {/* Tour Details Modal */}
        <AnimatePresence>
          {selectedTour && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-night/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTour(null)}
            >
              <motion.div
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface rounded-2xl shadow-xl border border-border/50 scrollbar-thin"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedTour(null)}
                  className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-border/50 text-muted hover:text-night cursor-pointer min-w-[44px] min-h-[44px]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <TourDetailsView
                  tour={selectedTour}
                  onBack={() => setSelectedTour(null)}
                  onPlanClick={() => {
                    const dest = selectedTour.title;
                    setSelectedTour(null);
                    setActiveConversationId(null);
                    setMode('chat');
                    setPendingPrompt(`Plan a trip to ${dest}`);
                  }}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistIds.includes(selectedTour.id)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentMode={mode}
          wishlistCount={wishlistIds.length}
          session={session}
          onNewChat={() => { setActiveConversationId(null); handleShowChat(); }}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={(id) => setConversations((prev) => prev.filter((c) => c.id !== id))}
          onShowProfile={handleShowProfile}
          onShowChat={handleShowChat}
          onSignIn={() => signIn()}
          onSignOut={() => signOut()}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-[100dvh] max-w-[900px] mx-auto w-full lg:pl-0 pl-[52px]">
          {mode === 'profile' ? (
            <ProfileView
              wishlistTours={wishlistTours}
              savedItineraries={savedItineraries}
              onTourSelect={(tour) => setSelectedTour(tour)}
              onRemoveWishlist={handleToggleWishlist}
              onDeleteItinerary={handleDeleteItinerary}
              allTours={displayTours}
              onBack={handleShowChat}
            />
          ) : (
            <ChatView
              tours={displayTours}
              wishlistIds={wishlistIds}
              savedItineraries={savedItineraries}
              onToggleWishlist={handleToggleWishlist}
              onSaveItinerary={handleSaveItinerary}
              onDeleteItinerary={handleDeleteItinerary}
              onShowTourDetail={(tour) => setSelectedTour(tour)}
              externalConversations={conversations}
              externalActiveId={activeConversationId}
              onConversationsChange={setConversations}
              onActiveConversationChange={setActiveConversationId}
              pendingPrompt={pendingPrompt}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
