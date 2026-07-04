"use client";
import { usePathname } from "next/navigation";
import Footer from "../frontend/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "") return null;
  return <Footer />;
}
