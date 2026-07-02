import { MetadataRoute } from 'next';

const BASE_URL = 'https://travebie-oneverce.vercel.app';

const DESTINATIONS = [
  { slug: 'varanasi-spiritual', name: 'Varanasi' },
  { slug: 'udaipur-mewar', name: 'Udaipur' },
  { slug: 'kerala-houseboats', name: 'Kerala' },
  { slug: 'ladakh-passes', name: 'Ladakh' },
  { slug: 'jaisalmer-fort', name: 'Jaisalmer' },
  { slug: 'goa-beach', name: 'Goa' },
  { slug: 'hampi-ruins', name: 'Hampi' },
  { slug: 'kashmir-meadows', name: 'Kashmir' },
  { slug: 'munnar-tea', name: 'Munnar' },
  { slug: 'kutch-salt', name: 'Kutch' },
  { slug: 'cherrapunji-roots', name: 'Cherrapunji' },
  { slug: 'andaman-reefs', name: 'Andaman' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/trips`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const destinationPages = DESTINATIONS.map((dest) => ({
    url: `${BASE_URL}/destination/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...destinationPages];
}
