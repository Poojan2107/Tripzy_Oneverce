import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Travebie — AI Travel Companion for India',
    short_name: 'Travebie',
    description: 'Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F4EE',
    theme_color: '#F4B63D',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
