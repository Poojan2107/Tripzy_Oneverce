import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Tripzy",
  description: "Privacy Policy for Tripzy AI Travel Companion.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-[100dvh] bg-background text-ink font-sans">
      <header className="w-full bg-surface border-b border-warm-gray/30 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-night">
              <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-display text-lg font-bold text-ink">Tripzy</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <h1 className="text-3xl font-display font-bold text-night">Privacy Policy</h1>
        <p className="text-xs text-muted">Last updated: June 2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">1. Information We Collect</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            We collect information you voluntarily provide, including your name, email address, travel preferences, and saved itineraries. We also collect anonymous usage data to improve our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">2. How We Use Your Information</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            Your information is used to personalize travel recommendations, generate AI itineraries, save your journeys, and improve the Platform. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">3. AI API Usage</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            When you generate an itinerary, your preferences are sent to our AI provider (Google Gemini) solely for the purpose of generating personalized travel recommendations. This data is not used for training or retained beyond the request.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">4. Data Storage</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            Your saved itineraries, wishlist, and profile data are stored securely. You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">5. Cookies</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            We use essential cookies for authentication and session management. We do not use third-party tracking cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-night">6. Your Rights</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below.
          </p>
        </section>

        <div className="pt-6 border-t border-warm-gray/30">
          <p className="text-xs text-muted">
            For privacy inquiries, contact{" "}
            <a href="mailto:tripzy.travell@gmail.com" className="text-gold underline">tripzy.travell@gmail.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
