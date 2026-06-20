"use client";
import { ReactNode } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
