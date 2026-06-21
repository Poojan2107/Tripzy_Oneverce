"use client";
import { useState, useEffect } from 'react';
import AdminView from '../../frontend/components/AdminView';
import { Tour } from '../../frontend/types';
import { TOURS_DATA } from '../../frontend/data';
import { getAllDestinations } from '../../backend/actions/tourActions';
import { useSession } from 'next-auth/react';
import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadTours = async () => {
      try {
        const res = await getAllDestinations();
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((d: any) => ({
            id: d.slug || d.id,
            title: d.name,
            subtitle: d.metadata?.subtitle || d.description?.slice(0, 80) + '...',
            description: d.description || '',
            category: (d.trending ? 'trending' : d.featured ? 'popular' : 'international') as 'trending' | 'popular' | 'weekend' | 'international',
            duration: d.duration || '5 Days',
            rating: d.price ? 4.8 + (d.price % 3) * 0.05 : 4.9,
            reviewsCount: d.reviews?.length || 0,
            price: d.price || 1500,
            location: `${d.city}, ${d.country}`,
            groupSize: d.groupSize || 'Max 6',
            difficulty: d.difficulty || 'Easy',
            bannerImage: d.images?.[0] || '/images/tours/varanasi-banner.jpg',
            images: d.images || [],
            itinerary: d.metadata?.itinerary || [],
            includedServices: d.metadata?.includedServices || [],
            reviews: d.reviews || [],
            tags: d.tags || [],
            moods: d.moods || [],
            latitude: d.latitude,
            longitude: d.longitude,
          }));
          setTours(mapped);
        } else {
          setTours(TOURS_DATA);
        }
      } catch {
        setTours(TOURS_DATA);
      }
    };
    if (session?.user?.role === "ADMIN") {
      loadTours();
    }
  }, [session]);

  const handleAddTour = (newTour: Tour) => {
    setTours((prev) => [newTour, ...prev]);
  };

  const handleUpdateTour = (updatedTour: Tour) => {
    setTours((prev) => prev.map((t) => t.id === updatedTour.id ? updatedTour : t));
  };

  const handleDeleteTour = (tourId: string) => {
    setTours((prev) => prev.filter((t) => t.id !== tourId));
  };

  const displayTours = isClient && tours.length > 0 ? tours : TOURS_DATA;

  if (status === "loading") {
    return (
      <div className="bg-sand min-h-screen flex flex-col items-center justify-center font-sans">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone animate-pulse">Verifying credentials...</span>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="bg-sand min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-light font-display lowercase">access denied</h1>
        <p className="text-xs text-stone max-w-xs mx-auto leading-relaxed">
          The section of Tripzy India you are trying to reach is restricted to administrators.
        </p>
        <a
          href="/"
          className="px-7 py-3 rounded-full bg-night text-white hover:bg-ink text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 inline-block"
        >
          return to home
        </a>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen">
      <AdminView
        tours={displayTours}
        wishlistCount={0}
        onAddTour={handleAddTour}
        onUpdateTour={handleUpdateTour}
        onDeleteTour={handleDeleteTour}
      />
    </div>
  );
}
