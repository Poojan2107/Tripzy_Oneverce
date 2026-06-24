"use client";
import { Tour } from "../types";
import HeroCarousel from "./home/HeroCarousel";
import StatusCapsule from "./home/StatusCapsule";
import CategoryScroller from "./home/CategoryScroller";
import FeaturedChapters from "./home/FeaturedChapters";
import TravelerStories from "./home/TravelerStories";
import AtlasPassportPreview from "./home/AtlasPassportPreview";
import CompanionPreview from "./home/CompanionPreview";
import JourneyCta from "./home/JourneyCta";
import WhyTripzy from "./home/WhyTripzy";
import SiteFooter from "./home/SiteFooter";

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
    <div className="bg-sand min-h-[100dvh] text-night selection:bg-coral/20 selection:text-night">
      <HeroCarousel tours={tours} onGoToPlanner={onGoToPlanner} onGoToExplore={onGoToExplore} onSelectTour={onSelectTour} />
      <StatusCapsule />
      <CategoryScroller onQuickCategoryClick={onQuickCategoryClick} />
      <AtlasPassportPreview />
      <WhyTripzy />
      <FeaturedChapters tours={tours} wishlistIds={wishlistIds} loadingDestinations={loadingDestinations} onSelectTour={onSelectTour} onToggleWishlist={onToggleWishlist} />
      <TravelerStories tours={tours} onSelectTour={onSelectTour} />
      <CompanionPreview />
      <JourneyCta onGoToPlanner={onGoToPlanner} onGoToExplore={onGoToExplore} />
      <SiteFooter />
    </div>
  );
}
