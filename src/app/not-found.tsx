import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-background text-ink font-sans flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
        <Compass className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-4xl font-display font-bold text-night mb-2">404</h1>
      <p className="text-sm text-muted mb-8 text-center max-w-sm">
        This page does not exist. It may have been moved or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
