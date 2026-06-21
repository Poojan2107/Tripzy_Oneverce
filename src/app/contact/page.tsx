import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Tripzy",
  description: "Get in touch with the Tripzy team.",
};

export default function ContactPage() {
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
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <h1 className="text-3xl font-display font-bold text-night">Contact</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-night uppercase tracking-wider">Email</h3>
                <a href="mailto:tripzy.travell@gmail.com" className="text-sm text-charcoal hover:text-gold transition-colors">
                  tripzy.travell@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-night uppercase tracking-wider">Location</h3>
                <p className="text-sm text-charcoal">India</p>
              </div>
            </div>
          </div>

          <div className="bg-cream border border-warm-gray/30 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-night uppercase tracking-wider">Send a Message</h2>
            <p className="text-xs text-muted leading-relaxed">
              Have a question, suggestion, or feedback? We'd love to hear from you. Send us an email and we'll get back to you.
            </p>
            <a
              href="mailto:tripzy.travell@gmail.com"
              className="inline-block px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light transition-all"
            >
              Email Us
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
