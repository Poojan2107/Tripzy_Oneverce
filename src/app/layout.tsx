import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Pacifico } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../frontend/styles/globals.css";
import Providers from "./providers";
import PageTransition from "../frontend/components/PageTransition";
import ConditionalFooter from "./ConditionalFooter";


const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  variable: "--font-sans",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
  display: "swap",
});


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://travebie.com");

export const metadata: Metadata = {
  title: {
    default: "Travebie — #1 AI Travel Companion & Itinerary Planner for India",
    template: "%s — Travebie",
  },
  description: "Discover India through 12 living chapters. AI-powered travel planner generating bespoke day-wise itineraries, photography spots, local secrets, and real-time budgets in ₹ INR.",
  keywords: [
    "AI travel planner India",
    "India itinerary generator",
    "custom India tour packages",
    "India travel guide 2026",
    "curated travel chapters",
    "Varanasi spiritual tour",
    "Kerala backwaters houseboat",
    "Ladakh high passes itinerary",
    "Rajasthan heritage guide",
    "Travebie",
    "travebie.com",
    "travel companion India",
    "budget travel India",
    "AI trip generator",
    "solo travel India"
  ],
  authors: [{ name: "Travebie Editorial Team", url: "https://travebie.com" }],
  creator: "Travebie",
  publisher: "Travebie",
  category: "Travel & Tourism",
  classification: "AI Travel Planner & Tourism Guide for India",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Travebie — #1 AI Travel Companion & Itinerary Planner for India",
    description: "Discover India through 12 living chapters. AI-powered travel planner generating bespoke day-wise itineraries, photography spots, local secrets, and ₹ INR budgets.",
    url: "https://travebie.com",
    siteName: "Travebie",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero-varanasi.jpg",
        width: 1200,
        height: 630,
        alt: "Travebie — #1 AI Travel Companion for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travebie — #1 AI Travel Companion & Itinerary Planner for India",
    description: "Discover India through 12 living chapters. AI-powered travel planner generating bespoke day-wise itineraries.",
    images: ["/images/hero-varanasi.jpg"],
    creator: "@travebie",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
    other: [
      { rel: "icon", sizes: "192x192", url: "/icons/icon-192.png" },
      { rel: "icon", sizes: "512x512", url: "/icons/icon-512.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Travebie",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#F8F5EE",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${pacifico.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
if ("serviceWorker" in navigator && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Travebie",
                url: "https://travebie.com",
                logo: "https://travebie.com/icons/icon-512.png",
                description: "AI-powered travel companion for exploring India through handcrafted chapters and custom itineraries.",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  url: "https://travebie.com/contact",
                  availableLanguage: ["English", "Hindi"],
                },
                sameAs: [
                  "https://travebie.com",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Travebie",
                url: "https://travebie.com",
                description: "AI Travel Companion & Itinerary Planner for India",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://travebie.com/?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Travebie",
                url: "https://travebie.com",
                description: "AI-powered travel companion for exploring India through handcrafted chapters.",
                image: "https://travebie.com/images/hero-varanasi.jpg",
                applicationCategory: "TravelApplication",
                operatingSystem: "Web, iOS, Android",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "INR",
                },
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IN",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://travebie.com" },
                  { "@type": "ListItem", position: 2, name: "Explore Atlas", item: "https://travebie.com/#explore" },
                  { "@type": "ListItem", position: 3, name: "AI Planner", item: "https://travebie.com/#ai-planner" },
                  { "@type": "ListItem", position: 4, name: "Passport", item: "https://travebie.com/#saved" },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "12 Curated India Travel Chapters",
                description: "Handcrafted Indian travel chapters curated by Travebie",
                numberOfItems: 12,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Varanasi Spiritual Chapter", url: "https://travebie.com/destination/varanasi-spiritual" },
                  { "@type": "ListItem", position: 2, name: "Udaipur Royal Mewar", url: "https://travebie.com/destination/udaipur-mewar" },
                  { "@type": "ListItem", position: 3, name: "Kerala Backwaters & Houseboats", url: "https://travebie.com/destination/kerala-houseboats" },
                  { "@type": "ListItem", position: 4, name: "Ladakh High Passes", url: "https://travebie.com/destination/ladakh-passes" },
                  { "@type": "ListItem", position: 5, name: "Jaisalmer Living Fort", url: "https://travebie.com/destination/jaisalmer-fort" },
                  { "@type": "ListItem", position: 6, name: "Goa Coastal Heritage", url: "https://travebie.com/destination/goa-beach" },
                  { "@type": "ListItem", position: 7, name: "Hampi Ancient Ruins", url: "https://travebie.com/destination/hampi-ruins" },
                  { "@type": "ListItem", position: 8, name: "Kashmir Alpine Meadows", url: "https://travebie.com/destination/kashmir-meadows" },
                  { "@type": "ListItem", position: 9, name: "Munnar Tea Sanctuaries", url: "https://travebie.com/destination/munnar-tea" },
                  { "@type": "ListItem", position: 10, name: "Kutch White Salt Desert", url: "https://travebie.com/destination/kutch-salt" },
                  { "@type": "ListItem", position: 11, name: "Cherrapunji Living Root Bridges", url: "https://travebie.com/destination/cherrapunji-roots" },
                  { "@type": "ListItem", position: 12, name: "Andaman Coral Reefs", url: "https://travebie.com/destination/andaman-reefs" },
                ],
              },
            ]),
          }}
        />
      </head>
      <body className="antialiased" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <Providers>
          <div className="flex flex-col min-h-[100dvh]">
            <PageTransition>
              <div className="flex-1">{children}</div>
            </PageTransition>
            <ConditionalFooter />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
