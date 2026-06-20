"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Heart, LogOut, Compass, ArrowRight } from "lucide-react";
import AuthLayout from "../../frontend/components/AuthLayout";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <AuthLayout title="Loading..." subtitle="Fetching your profile.">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-ocean border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (!session?.user) {
    return (
      <AuthLayout title="Sign in required" subtitle="Log in to view your profile.">
        <div className="text-center space-y-4">
          <User className="w-10 h-10 text-stone mx-auto" />
          <Link
            href="/login?callbackUrl=/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-deep-navy text-white text-sm font-medium hover:bg-charcoal transition-all"
          >
            <span>Sign in</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-warm-mist pt-28 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ocean hover:text-sky transition-colors">
            <Compass className="w-4 h-4" />
            Back to Tripzy
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-warm-gray/30 shadow-card p-8">
          <div className="flex items-center gap-4 mb-6">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Profile"}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center">
                <User className="w-8 h-8 text-ocean" />
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl text-deep-navy">{session.user.name || "Traveler"}</h1>
              <p className="text-sm text-charcoal/60">{session.user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/#saved"
              className="flex items-center justify-between p-4 rounded-xl bg-warm-mist hover:bg-soft-gray transition-colors"
            >
              <span className="flex items-center gap-3 text-sm text-deep-navy">
                <Heart className="w-4 h-4 text-ocean" />
                Saved destinations & itineraries
              </span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-warm-gray/40 text-sm text-charcoal/70 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
