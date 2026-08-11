import { MetadataRoute } from 'next';
import { db } from '../backend/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://travebie.com';

const FALLBACK_DESTINATIONS = [
  'varanasi-spiritual',
  'udaipur-mewar',
  'kerala-houseboats',
  'ladakh-passes',
  'jaisalmer-fort',
  'goa-beach',
  'hampi-ruins',
  'kashmir-meadows',
  'munnar-tea',
  'kutch-salt',
  'cherrapunji-roots',
  'andaman-reefs',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/trips`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  let slugs = FALLBACK_DESTINATIONS;

  try {
    const destinations = await db.destination.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
    if (destinations && destinations.length > 0) {
      const destinationPages: MetadataRoute.Sitemap = destinations.map((d: { slug: string; updatedAt: Date | null }) => ({
        url: `${BASE_URL}/destination/${d.slug}`,
        lastModified: d.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
      return [...staticPages, ...destinationPages];
    }
  } catch (e) {
    console.warn('[sitemap] Failed to fetch database destinations, using fallback list:', e);
  }

  const destinationPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/destination/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticPages, ...destinationPages];
}
