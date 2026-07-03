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
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
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

export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  priceRange: string;
  image: string;
  amenities: string[];
  location: string;
  destinationId: string;
  affiliateLinks: {
    goibibo?: string;
    agoda?: string;
    makemytrip?: string;
  };
}

export type TabType = 'home' | 'explore' | 'ai-planner' | 'saved';

// ─── V2 Chat Types ───

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type ParsedSectionType =
  | 'overview'
  | 'timeline'
  | 'hotels'
  | 'budget'
  | 'food'
  | 'transport'
  | 'packing'
  | 'weather'
  | 'map'
  | 'tips'
  | 'experiences'
  | 'hidden_gems'
  | 'photography'
  | 'etiquette'
  | 'avoid'
  | 'emergency'
  | 'festivals'
  | 'nearby'
  | 'unknown';

export interface ParsedSection {
  type: ParsedSectionType;
  title: string;
  content: string;
}
