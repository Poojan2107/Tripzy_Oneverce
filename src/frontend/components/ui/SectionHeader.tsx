interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      <div className={`flex items-center gap-3 mb-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-accent/60" />
        <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted font-sans text-base sm:text-lg mt-4 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
