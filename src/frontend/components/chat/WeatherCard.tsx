"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, ChevronDown, CloudRain, Snowflake, Cloud } from 'lucide-react';

function parseSeasons(text: string): { season: string | null; lines: string[]; icon: React.ReactNode }[] {
  const lines = text.split('\n').filter(Boolean);
  const seasons: { season: string | null; lines: string[]; icon: React.ReactNode }[] = [];
  let current: { season: string | null; lines: string[]; icon: React.ReactNode } | null = null;

  const seasonIcons: Record<string, React.ReactNode> = {
    summer: <Sun className="w-3.5 h-3.5 text-gold" />,
    winter: <Snowflake className="w-3.5 h-3.5 text-blue" />,
    monsoon: <CloudRain className="w-3.5 h-3.5 text-blue/60" />,
    spring: <Sun className="w-3.5 h-3.5 text-teal" />,
    autumn: <Cloud className="w-3.5 h-3.5 text-amber" />,
  };

  for (const line of lines) {
    const cleaned = line.replace(/^[-–*•☀️🌤️🌧️❄️]\s*/, '').trim();
    if (!cleaned) continue;

    const seasonMatch = cleaned.match(/^(summer|winter|monsoon|spring|autumn|rainy|peak|off.season)/i);
    const colonMatch = cleaned.match(/^(.+?)[:]\s*(.+)/);

    if (seasonMatch || (colonMatch && seasonMatch)) {
      if (current && current.lines.length > 0) seasons.push(current);
      const seasonKey = (seasonMatch?.[1] || colonMatch?.[1] || '').toLowerCase();
      const icon = Object.entries(seasonIcons).find(([k]) => seasonKey.includes(k))?.[1] || <Sun className="w-3.5 h-3.5 text-muted/40" />;
      current = {
        season: cleaned,
        lines: colonMatch ? [colonMatch[2].trim()] : [],
        icon,
      };
    } else if (current) {
      current.lines.push(cleaned);
    } else {
      if (!current) {
        current = { season: null, lines: [], icon: <Sun className="w-3.5 h-3.5 text-gold" /> };
      }
      current.lines.push(cleaned);
    }
  }
  if (current && current.lines.length > 0) seasons.push(current);
  if (seasons.length === 0) {
    seasons.push({ season: null, lines: [text], icon: <Sun className="w-3.5 h-3.5 text-gold" /> });
  }
  return seasons;
}

export default function WeatherCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const seasons = parseSeasons(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Sun className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Weather & Best Time</h3>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {seasons.map((season, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-background border border-border/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-background border border-border/40 flex items-center justify-center">
                      {season.icon}
                    </div>
                    {season.season && (
                      <span className="text-caption text-night font-semibold">{season.season}</span>
                    )}
                  </div>
                  {season.lines.map((line, li) => (
                    <p key={li} className="text-caption text-muted/80 leading-relaxed pl-8">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
