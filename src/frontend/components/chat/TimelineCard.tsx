"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, Sun, SunDim, Sunset, Moon } from 'lucide-react';

interface DayEntry {
  day: number;
  title: string;
  slots: { label: string; icon: React.ReactNode; content: string }[];
  raw: string;
}

const TIME_ICONS: Record<string, React.ReactNode> = {
  morning: <Sun className="w-3 h-3 text-gold" />,
  afternoon: <SunDim className="w-3 h-3 text-amber" />,
  evening: <Sunset className="w-3 h-3 text-coral" />,
  night: <Moon className="w-3 h-3 text-blue" />,
};

const TIME_LABELS = ['morning', 'afternoon', 'evening', 'night'];

function parseDays(content: string): DayEntry[] {
  const lines = content.split('\n');
  const days: DayEntry[] = [];
  let current: DayEntry | null = null;

  for (const line of lines) {
    const dayMatch = line.match(/^day\s*(\d+)[:\s–-]+(.+)/i) || line.match(/^\*\*day\s*(\d+)[:\s–-]+(.+)\*\*/i);
    if (dayMatch) {
      if (current) days.push(current);
      current = { day: parseInt(dayMatch[1]), title: dayMatch[2].trim(), slots: [], raw: '' };
    } else if (current) {
      const lower = line.toLowerCase().trim();
      const timeLabel = TIME_LABELS.find((t) => lower.startsWith(`**${t}**`) || lower.startsWith(`${t}`));
      if (timeLabel) {
        const body = line.replace(/^\*\*(morning|afternoon|evening|night)\*\*[:\s–-]*/i, '').replace(/^(morning|afternoon|evening|night)[:\s–-]*/i, '').trim();
        current.slots.push({
          label: timeLabel,
          icon: TIME_ICONS[timeLabel] || null,
          content: body || `(${timeLabel})`,
        });
      } else {
        current.raw += (current.raw ? '\n' : '') + line;
      }
    }
  }
  if (current) days.push(current);
  return days;
}

export default function TimelineCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);
  const days = parseDays(content);

  return (
    <div className="bg-surface border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-teal" />
          <h3 className="font-display text-card text-night font-light">Itinerary</h3>
          {days.length > 0 && (
            <span className="text-micro text-muted/50 font-mono">{days.length} Days</span>
          )}
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
            <div className="px-5 pb-5 space-y-5">
              {days.length > 0 ? (
                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                  {days.map((day) => (
                    <div key={day.day} className="relative">
                      <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-teal/20 border-2 border-teal" />
                      <span className="text-micro font-mono text-teal font-bold tracking-wider">Day {day.day}</span>
                      <h4 className="text-body text-night font-semibold mt-0.5 mb-2">{day.title}</h4>

                      {day.slots.length > 0 && (
                        <div className="space-y-1.5">
                          {day.slots.map((slot, si) => (
                            <div key={si} className="flex items-start gap-2.5 py-1.5">
                              <div className="w-5 h-5 rounded-full bg-background border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                                {slot.icon}
                              </div>
                              <div className="flex-1">
                                <span className="text-micro font-mono font-bold uppercase tracking-wider text-muted/50">
                                  {slot.label}
                                </span>
                                <p className="text-caption text-muted/80 leading-relaxed mt-0.5">{slot.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {day.raw && (
                        <p className="text-caption text-muted/70 leading-relaxed whitespace-pre-wrap mt-1">{day.raw}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
