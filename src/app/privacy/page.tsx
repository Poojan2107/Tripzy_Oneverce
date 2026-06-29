import type { Metadata } from "next";
import PrivacyView from "./PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy — Travebie",
  description: "Review the privacy policy for using the Travebie AI travel discovery companion.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
