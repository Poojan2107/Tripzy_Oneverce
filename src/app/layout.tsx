import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, La_Belle_Aurore } from "next/font/google";
import "../frontend/styles/globals.css";
import Providers from "./providers";
import Footer from "../frontend/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const laBelleAurore = La_Belle_Aurore({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-handwritten",
  display: "swap",
});

const baseUrl = "https://tripzy-oneverce.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Tripzy — AI Travel Companion for India",
    template: "%s — Tripzy",
  },
  description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tripzy — AI Travel Companion for India",
    description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
    url: baseUrl,
    siteName: "Tripzy",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero-varanasi.jpg",
        width: 1200,
        height: 630,
        alt: "Tripzy — Explore India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripzy — AI Travel Companion for India",
    description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
    images: ["/images/hero-varanasi.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
    <html lang="en" className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${laBelleAurore.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Tripzy",
              url: baseUrl,
              description: "AI-powered travel companion for exploring India through handcrafted chapters.",
              image: `${baseUrl}/images/hero-varanasi.jpg`,
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <Providers>
          <div className="flex flex-col min-h-[100dvh]">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
