"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

export default function ShareError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
      <Compass className="w-12 h-12 text-gold mb-4" />
      <h1 className="font-display text-2xl text-night font-light lowercase mb-2">itinerary unavailable</h1>
      <p className="text-sm text-muted/60 font-light max-w-xs mb-6">This shared itinerary could not be loaded right now.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-5 py-2.5 btn-night text-micro font-bold uppercase tracking-wider rounded-xl cursor-pointer">try again</button>
        <Link href="/" className="px-5 py-2.5 border border-border text-micro font-bold uppercase tracking-wider rounded-xl hover:bg-secondary-surface transition-all">go home</Link>
      </div>
    </div>
  );
}
