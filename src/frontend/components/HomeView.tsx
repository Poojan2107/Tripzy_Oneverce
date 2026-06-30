"use client";
import { Tour } from "../types";
import HeroCarousel from "./home/HeroCarousel";
import CategoryScroller from "./home/CategoryScroller";
import FeaturedChapters from "./home/FeaturedChapters";
import TravelerStories from "./home/TravelerStories";
import AtlasPassportPreview from "./home/AtlasPassportPreview";
import CompanionPreview from "./home/CompanionPreview";
import WhyTravebie from "./home/WhyTravebie";

interface HomeViewProps {
  tours: Tour[];
  wishlistIds: string[];
  loadingDestinations: boolean;
  onSearchClick: () => void;
  onQuickCategoryClick: (category: string) => void;
  onSelectTour: (tour: Tour) => void;
  onToggleWishlist: (tourId: string) => void;
  onGoToExplore: () => void;
  onGoToPlanner: () => void;
}

export default function HomeView(props: HomeViewProps) {
  const { tours, wishlistIds, loadingDestinations, onQuickCategoryClick, onSelectTour, onToggleWishlist, onGoToExplore, onGoToPlanner } = props;

  return (
    <div className="bg-background min-h-[100dvh] text-night selection:bg-coral/20 selection:text-night">
      <HeroCarousel tours={tours} onGoToPlanner={onGoToPlanner} onGoToExplore={onGoToExplore} onSelectTour={onSelectTour} />
      <CategoryScroller onQuickCategoryClick={onQuickCategoryClick} />
      <AtlasPassportPreview onGoToExplore={onGoToExplore} onGoToPassport={onGoToExplore} />
      <WhyTravebie />
      <FeaturedChapters tours={tours} wishlistIds={wishlistIds} loadingDestinations={loadingDestinations} onSelectTour={onSelectTour} onToggleWishlist={onToggleWishlist} onGoToExplore={onGoToExplore} />
      <TravelerStories tours={tours} onSelectTour={onSelectTour} />
      <CompanionPreview onGoToPlanner={onGoToPlanner} />
    </div>
  );
}
