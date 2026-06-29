"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const ItineraryMap = dynamic(() => import('../../../frontend/components/map/ItineraryMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] lg:h-full bg-cream flex flex-col items-center justify-center animate-pulse border border-border/30">
      <span className="text-[10px] font-bold text-muted tracking-wider">LOADING MAP ROUTE...</span>
    </div>
  )
});

interface SharedMapProps {
  itinerary: any[];
}

export default function SharedMap({ itinerary }: SharedMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] lg:h-full">
      <ItineraryMap days={itinerary} activeDay={0} />
    </div>
  );
}
