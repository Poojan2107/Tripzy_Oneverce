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
      description: "The destination you are looking for could not be found.",
    };
  }

  const tour = res.data;
  const title = `${tour.title} Travel Guide — Travebie`;
  const description = tour.metaDescription || tour.description?.slice(0, 155) || `Explore ${tour.title} with curated itineraries.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: tour.ogImage || tour.bannerImage ? [{ url: tour.ogImage || tour.bannerImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: tour.ogImage || tour.bannerImage ? [tour.ogImage || tour.bannerImage] : [],
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

  return <DestinationPageClient tour={res.data} />;
}
