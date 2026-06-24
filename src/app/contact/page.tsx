import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact Us — Tripzy",
  description: "Get in touch with the Tripzy team for questions, feedback, and support.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactView />;
}
