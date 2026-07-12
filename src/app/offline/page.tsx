import { Compass } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline — Travebie",
  description: "You appear to be offline. Some content may still be available from your last visit.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
      <Compass className="w-12 h-12 text-gold mb-4" />
      <h1 className="font-display text-2xl text-night font-light lowercase mb-2">no signal</h1>
      <p className="text-sm text-muted/60 font-light max-w-xs mb-6">
        You appear to be offline. Some content may still be available from your last visit.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 btn-night text-micro font-bold uppercase tracking-wider rounded-xl"
      >
        retry
      </Link>
    </div>
  );
}
