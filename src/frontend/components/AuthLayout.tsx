import { Compass } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-warm-mist flex flex-col relative overflow-hidden">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 py-5">
          <Link href="/" className="flex items-center gap-2 w-fit group">
            <div className="w-8 h-8 rounded-full bg-ocean flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-display text-xl text-deep-navy">Tripzy</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-md">
            {/* Decorative line */}
            <div className="w-12 h-0.5 bg-ocean rounded-full mb-6" />

            <h1 className="font-display text-3xl text-deep-navy leading-tight">{title}</h1>
            <p className="text-sm text-charcoal/60 mt-1.5 mb-8">{subtitle}</p>

            {children}
          </div>
        </div>

        <div className="px-6 py-4 text-center text-xs text-charcoal/40 border-t border-warm-gray/30">
          <p>&copy; 2026 Tripzy. AI-powered travel discovery.</p>
        </div>
      </div>
    </div>
  );
}
