"use client";
import { useState, useEffect } from 'react';
import AdminView from '../../frontend/components/AdminView';
import { Tour } from '../../frontend/types';
import { TOURS_DATA } from '../../frontend/data';
import { getAllDestinations } from '../../backend/actions/tourActions';

export default function AdminPage() {
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
            bannerImage: d.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
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
    loadTours();
  }, []);

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

  return (
    <div className="bg-[#090909] text-white min-h-screen">
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
