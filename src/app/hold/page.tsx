import React from "react";
import type { Metadata } from "next";
import ProjectHoldNotice from "../components/ProjectHoldNotice";

export const metadata: Metadata = {
  title: "Project On Hold — ONEVERCE SOLUTIONS",
  description: "This project is currently on hold pending milestone payment settlement.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HoldPage() {
  return <ProjectHoldNotice />;
}
