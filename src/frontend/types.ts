export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface IncludedService {
  name: string;
  iconName: string;
}

export interface TourReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Tour {
  id: string;
  dbId?: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'trending' | 'popular' | 'weekend' | 'international';
  duration: string;
  rating: number;
  reviewsCount: number;
  price: number;
  location: string;
  groupSize: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  bannerImage: string;
  images: string[];
  itinerary: ItineraryItem[];
  includedServices: IncludedService[];
  reviews: TourReview[];
  tags: string[];
  moods: string[];
  activities?: string[];
  latitude?: number;
  longitude?: number;
  bestSeason?: string;
  
  // PRD Metadata Fields
  chapterName?: string;
  chapterTitle?: string;
  storyHeadline?: string;
  storyNarrative?: string;
  highlights?: string[];
  localSecret?: string;
  photographySpot?: string;
  signatureExperience?: string;
  budgetRange?: string;
  accents?: {
    primary: string;
    secondary: string;
  };
}

export interface BookingState {
  fullName: string;
  email: string;
  date: string;
  guests: number;
  specialRequests: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  bannerImage: string;
  price: number;
  rating: number;
  location: string;
}

export type TabType = 'home' | 'explore' | 'ai-planner' | 'saved';
