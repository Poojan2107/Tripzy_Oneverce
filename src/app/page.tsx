import type { Metadata } from "next";
import App from "../frontend/App";
import ProjectHoldNotice from "./components/ProjectHoldNotice";

export const metadata: Metadata = {
  title: "Project On Hold — ONEVERCE SOLUTIONS",
  description: "This project is currently on hold pending final payment settlement.",
  robots: {
    index: false,
    follow: false,
  },
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Travebie AI Travel Planner create custom India itineraries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Travebie uses advanced AI to analyze your travel style (solo, couple, culture, nature, luxury, adventure), group size, pace, and budget. It crafts custom day-wise schedules complete with local insider secrets, photography spots, and estimated costs in ₹ INR.",
      },
    },
    {
      "@type": "Question",
      name: "What destinations in India are curated in the Travebie Atlas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Travebie currently features 12 living chapters across India, including Varanasi, Udaipur, Kerala, Ladakh, Jaisalmer, Goa, Hampi, Kashmir, Munnar, Kutch, Cherrapunji, and the Andaman Islands.",
      },
    },
    {
      "@type": "Question",
      name: "Is Travebie free to use for planning travel in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Travebie is completely free to use. You can generate unlimited custom itineraries, chat with the AI Travel Companion, and save chapters to your digital Passport.",
      },
    },
    {
      "@type": "Question",
      name: "Does Travebie provide cost estimates in Indian Rupees (INR)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every day in your generated itinerary includes comprehensive cost breakdowns in ₹ INR for accommodation, local transit, food, and activities.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      {/* Locked Hero Section in Background (Frozen at Hero, No Scroll) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <App />
      </div>

      {/* Single Scrollable Hold Notice Overlay */}
      <ProjectHoldNotice />
    </div>
  );
}
