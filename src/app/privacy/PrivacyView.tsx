"use client";
import { motion } from 'framer-motion';
import Link from "next/link";
import { Compass } from "lucide-react";
import Footer from "../../frontend/components/Footer";

const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };

export default function PrivacyView() {
  return (
    <div className="w-full min-h-[100dvh] bg-background text-night font-sans">
      <header className="w-full bg-surface border-b border-border/30 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-night">
              <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-display text-lg font-bold text-night">Travebie</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <motion.h1 className="text-3xl font-display font-bold text-night"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}>Privacy Policy</motion.h1>
        <motion.p className="text-xs text-muted"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>Last updated: June 2026</motion.p>

        <motion.div className="space-y-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">1. Information We Collect</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              We collect information you voluntarily provide, including your name, email address, travel preferences, and saved itineraries. We also collect anonymous usage data to improve our service.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">2. How We Use Your Information</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              Your information is used to personalize travel recommendations, generate AI itineraries, save your journeys, and improve the Platform. We do not sell your personal data to third parties.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">3. AI API Usage</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              When you generate an itinerary, your preferences are sent to our AI provider (Google Gemini) solely for the purpose of generating personalized travel recommendations. This data is not used for training or retained beyond the request.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">4. Data Storage</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              Your saved itineraries, wishlist, and profile data are stored securely. You may request deletion of your data at any time by contacting us.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">5. Cookies</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              We use essential cookies for authentication and session management. We do not use third-party tracking cookies.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-night">6. Your Rights</h2>
            <p className="text-sm text-charcoal leading-relaxed">
              You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below.
            </p>
          </motion.section>
        </motion.div>

        <motion.div className="pt-6 border-t border-border/30"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }}>
          <p className="text-xs text-muted">
            For privacy inquiries, contact{" "}
            <a href="mailto:tripzy.travell@gmail.com" className="text-gold underline">tripzy.travell@gmail.com</a>.
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
