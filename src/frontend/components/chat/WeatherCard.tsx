"use client";
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, ChevronDown, CloudRain, Snowflake, Cloud, Calendar, Users, Backpack, Star } from 'lucide-react';

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

function parseStructuredWeather(content: string): {
  bestMonths: string | null;
  currentSeason: string | null;
  temperature: string | null;
  crowdLevel: string | null;
  packingReminder: string | null;
  travelTip: string | null;
} {
  const result = {
    bestMonths: null as string | null,
    currentSeason: null as string | null,
    temperature: null as string | null,
    crowdLevel: null as string | null,
    packingReminder: null as string | null,
    travelTip: null as string | null,
  };

  const bestMonthsMatch = content.match(/\*\*Best\s*Months?\*\*[:\s]*(.+)/i);
  if (bestMonthsMatch) result.bestMonths = bestMonthsMatch[1].trim();

  const seasonMatch = content.match(/\*\*(?:Current\s*)?Season\*\*[:\s]*(.+)/i);
  if (seasonMatch) result.currentSeason = seasonMatch[1].trim();

  const tempMatch = content.match(/(\d+\s*[–-]\s*\d+\s*°C|\d+\s*°C)/);
  if (tempMatch) result.temperature = tempMatch[1].trim();

  const crowdMatch = content.match(/\*\*Crowd\s*Level\*\*[:\s]*(.+)/i);
  if (crowdMatch) result.crowdLevel = crowdMatch[1].trim();

  const packingMatch = content.match(/\*\*Packing\s*(?:Reminder|Essentials|List)?\s*\*\*[:\s]*(.+)/i);
  if (packingMatch) result.packingReminder = packingMatch[1].trim();

  const tipMatch = content.match(/\*\*(?:Travel|Pro)\s*Tip\s*\*\*[:\s]*(.+)/i);
  if (tipMatch) result.travelTip = tipMatch[1].trim();

  return result;
}

const WeatherCard = memo(function WeatherCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const seasons = parseSeasons(content);
  const structured = parseStructuredWeather(content);
  const hasStructured = structured.bestMonths || structured.currentSeason || structured.temperature || structured.crowdLevel || structured.packingReminder || structured.travelTip;

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Sun className="w-4 h-4 text-gold" />
          <h3 className="font-display text-card text-night font-light">Weather</h3>
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
            <div className="px-4 pb-4">
              {hasStructured ? (
                <div className="grid grid-cols-2 gap-2">
                  {structured.bestMonths && (
                    <div className="p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-gold" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Best Months</span>
                      </div>
                      <p className="text-caption text-night font-semibold">{structured.bestMonths}</p>
                    </div>
                  )}
                  {structured.temperature && (
                    <div className="p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sun className="w-3 h-3 text-amber" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Temperature</span>
                      </div>
                      <p className="text-caption text-night font-semibold">{structured.temperature}</p>
                    </div>
                  )}
                  {structured.currentSeason && (
                    <div className="p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CloudRain className="w-3 h-3 text-blue/60" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Current Season</span>
                      </div>
                      <p className="text-caption text-night font-semibold">{structured.currentSeason}</p>
                    </div>
                  )}
                  {structured.crowdLevel && (
                    <div className="p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="w-3 h-3 text-coral" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Crowd Level</span>
                      </div>
                      <p className="text-caption text-night font-semibold">{structured.crowdLevel}</p>
                    </div>
                  )}
                  {structured.packingReminder && (
                    <div className="col-span-2 p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Backpack className="w-3 h-3 text-teal" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Packing Reminder</span>
                      </div>
                      <p className="text-caption text-night/80 leading-relaxed">{structured.packingReminder}</p>
                    </div>
                  )}
                  {structured.travelTip && (
                    <div className="col-span-2 p-3 rounded-xl bg-background border border-border/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Star className="w-3 h-3 text-gold" />
                        <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">Travel Tip</span>
                      </div>
                      <p className="text-caption text-night/80 leading-relaxed">{structured.travelTip}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default WeatherCard;
