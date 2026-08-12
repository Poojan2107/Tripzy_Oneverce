import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Travebie — #1 AI Travel Companion for India',
    short_name: 'Travebie',
    description: 'Discover India through 12 living chapters. AI-powered travel planner generating bespoke day-wise itineraries, photography spots, and real-time INR budgets.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'en-IN',
    categories: ['travel', 'lifestyle', 'navigation'],
    background_color: '#F8F4EE',
    theme_color: '#F4B63D',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
  };
}
