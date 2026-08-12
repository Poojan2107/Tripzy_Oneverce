import { Metadata } from "next";
import { getDestinationBySlug } from "@/src/backend/actions/tourActions";
import DestinationPageClient from "./DestinationPageClient";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Destination Not Found — Travebie",
      description: "The chapter you are looking for could not be found.",
    };
  }

  const tour = res.data;
  const title = tour.metaTitle || `${tour.title} Travel Guide & Curated Itinerary (2026) — Travebie`;
  const description = tour.metaDescription || tour.description?.slice(0, 155) || `Explore ${tour.title} with curated itineraries, local secrets, photography spots, and travel costs.`;
  const canonicalUrl = `https://travebie.com/destination/${slug}`;
  const bannerImage = tour.ogImage || tour.bannerImage || "/images/hero-varanasi.jpg";

  return {
    title,
    description,
    keywords: [
      `${tour.title} travel guide`,
      `${tour.title} itinerary`,
      `visit ${tour.title} India`,
      `${tour.location} tourism`,
      `best time to visit ${tour.title}`,
      `${tour.title} tour package`,
      `Travebie ${tour.title}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Travebie",
      type: "article",
      locale: "en_IN",
      images: [
        {
          url: bannerImage,
          width: 1200,
          height: 630,
          alt: `${tour.title} — Travebie Travel Guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerImage],
      creator: "@travebie",
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="font-display text-3xl text-night font-light">Destination not found</h1>
          <p className="text-stone text-sm">The chapter you are looking for does not exist.</p>
          <a href="/" className="inline-block mt-4 px-6 py-3 bg-gold text-night text-micro font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-gold/90 transition-colors">
            return home
          </a>
        </div>
      </div>
    );
  }

  const tour = res.data;
  const canonicalUrl = `https://travebie.com/destination/${slug}`;
  const bannerImg = tour.bannerImage
    ? tour.bannerImage.startsWith("http")
      ? tour.bannerImage
      : `https://travebie.com${tour.bannerImage}`
    : "https://travebie.com/images/hero-varanasi.jpg";

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: `${tour.title} — ${tour.chapterTitle || "Curated Travel Guide"}`,
      description: tour.description,
      url: canonicalUrl,
      image: [bannerImg],
      containedInPlace: {
        "@type": "Country",
        name: "India",
      },
      ...(tour.latitude && tour.longitude
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: tour.latitude,
              longitude: tour.longitude,
            },
          }
        : {}),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (tour.rating || 4.9).toString(),
        reviewCount: (tour.reviewsCount || 48).toString(),
        bestRating: "5",
        worstRating: "1",
      },
      touristType: tour.tags || ["Spiritual", "Culture", "Heritage"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${tour.title} Travel Guide & Curated Itinerary`,
      description: tour.metaDescription || tour.description?.slice(0, 160),
      image: [bannerImg],
      url: canonicalUrl,
      author: {
        "@type": "Organization",
        name: "Travebie",
        url: "https://travebie.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Travebie",
        logo: {
          "@type": "ImageObject",
          url: "https://travebie.com/icons/icon-512.png",
        },
      },
      mainEntityOfPage: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://travebie.com" },
        { "@type": "ListItem", position: 2, name: "Explore Atlas", item: "https://travebie.com/#explore" },
        { "@type": "ListItem", position: 3, name: tour.title, item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the best time to visit ${tour.title}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `The best season to visit ${tour.title} is ${tour.bestSeason || "October to March"} when the climate is ideal for sightseeing, cultural tours, and photography.`,
          },
        },
        {
          "@type": "Question",
          name: `How many days are ideal for exploring ${tour.title}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `We recommend at least ${tour.duration || "3 to 5 Days"} in ${tour.title} to explore all major landmarks, heritage locations, and local culinary treasures.`,
          },
        },
        {
          "@type": "Question",
          name: `What makes ${tour.title} a must-visit destination in India?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: tour.subtitle || `Experience the rich cultural tapestry, scenic landscapes, and living traditions of ${tour.title} with curated Travebie itineraries.`,
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <DestinationPageClient tour={res.data} />
    </>
  );
}
