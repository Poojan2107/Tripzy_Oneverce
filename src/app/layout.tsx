import type { Metadata, Viewport } from "next";
import "../frontend/styles/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Tripzy — AI Travel Companion for India",
  description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
  openGraph: {
    title: "Tripzy — AI Travel Companion for India",
    description: "Discover India through 12 handcrafted chapters. AI-powered itinerary planner for the curious explorer.",
    type: "website",
    locale: "en_IN",
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
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
