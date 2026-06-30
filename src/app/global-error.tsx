"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="antialiased bg-background text-night">
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
            <span className="text-gold text-xl font-bold">!</span>
          </div>
          <h1 className="font-display text-2xl font-light lowercase mb-2">something went wrong</h1>
          <p className="text-xs text-muted max-w-xs text-center mb-6">
            We've been notified and will look into it. Please try again.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 btn-primary font-bold text-micro uppercase tracking-wider rounded-xl min-h-[40px]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
