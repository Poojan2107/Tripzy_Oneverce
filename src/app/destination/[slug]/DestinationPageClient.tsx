"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tour } from '../../../frontend/types';
import TourDetailsView from '../../../frontend/components/TourDetailsView';

interface Props {
  tour: Tour;
}

export default function DestinationPageClient({ tour }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <TourDetailsView
        tour={tour}
        onBack={() => router.back()}
        onPlanClick={() => router.push('/#ai-planner')}
        onToggleWishlist={() => {}}
        isWishlisted={false}
      />
    </div>
  );
}
