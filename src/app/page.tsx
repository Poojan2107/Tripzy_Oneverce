import type { Metadata } from "next";
import App from "../frontend/App";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <App />
  );
}
