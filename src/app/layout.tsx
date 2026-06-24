import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "../frontend/styles/globals.css";
import Providers from "./providers";
import PageTransition from "../frontend/components/PageTransition";


const inter = Inter({
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
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
            <PageTransition>{children}</PageTransition>
          </div>
        </Providers>
      </body>
    </html>
  );
}
