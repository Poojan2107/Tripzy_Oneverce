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


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://tripzy-oneverce.vercel.app");

export const metadata: Metadata = {
  title: {
    default: "Travebie — AI Travel Companion for India",
    template: "%s — Travebie",
  },
  description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Travebie — AI Travel Companion for India",
    description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
    url: baseUrl,
    siteName: "Travebie",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero-varanasi.jpg",
        width: 1200,
        height: 630,
        alt: "Travebie — Explore India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travebie — AI Travel Companion for India",
    description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
    images: ["/images/hero-varanasi.jpg"],
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
                "@type": "WebApplication",
                name: "Travebie",
                url: baseUrl,
                description: "AI-powered travel companion for exploring India through handcrafted chapters.",
                image: `${baseUrl}/images/hero-varanasi.jpg`,
                applicationCategory: "TravelApplication",
                operatingSystem: "Web",
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
                  { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
                  { "@type": "ListItem", position: 2, name: "Explore Atlas", item: `${baseUrl}/#explore` },
                  { "@type": "ListItem", position: 3, name: "AI Planner", item: `${baseUrl}/#ai-planner` },
                  { "@type": "ListItem", position: 4, name: "Passport", item: `${baseUrl}/#saved` },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "India Travel Destinations",
                description: "12 handcrafted Indian chapters curated by Travebie",
                numberOfItems: 12,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Varanasi" },
                  { "@type": "ListItem", position: 2, name: "Udaipur" },
                  { "@type": "ListItem", position: 3, name: "Kerala" },
                  { "@type": "ListItem", position: 4, name: "Ladakh" },
                  { "@type": "ListItem", position: 5, name: "Jaisalmer" },
                  { "@type": "ListItem", position: 6, name: "Goa" },
                  { "@type": "ListItem", position: 7, name: "Hampi" },
                  { "@type": "ListItem", position: 8, name: "Kashmir" },
                  { "@type": "ListItem", position: 9, name: "Munnar" },
                  { "@type": "ListItem", position: 10, name: "Kutch" },
                  { "@type": "ListItem", position: 11, name: "Cherrapunji" },
                  { "@type": "ListItem", position: 12, name: "Andaman" },
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
