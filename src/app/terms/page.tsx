import type { Metadata } from "next";
import TermsView from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Service — Travebie",
  description: "Review the terms and conditions for using the Travebie AI travel discovery companion.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TermsView />;
}
