import type { Metadata } from "next";
import TermsView from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Service — Tripzy",
  description: "Review the terms and conditions for using the Tripzy AI travel Discovery companion.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TermsView />;
}
