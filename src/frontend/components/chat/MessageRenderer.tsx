"use client";
import { useMemo, memo, useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { parseAiResponse } from '../../lib/parseAiResponse';
import TravelOverviewCard from './TravelOverviewCard';
import JsonItineraryDashboard from './JsonItineraryDashboard';
import { Compass } from 'lucide-react';
import TimelineCard from './TimelineCard';
import HotelGrid from './HotelGrid';
import BudgetCard from './BudgetCard';
import PackingCard from './PackingCard';
import FoodCard from './FoodCard';
import TransportCard from './TransportCard';
import WeatherCard from './WeatherCard';
import TipsCard from './TipsCard';
import ExperiencesCard from './ExperiencesCard';
import HiddenGemsCard from './HiddenGemsCard';
import PhotographyCard from './PhotographyCard';
import EtiquetteCard from './EtiquetteCard';
import AvoidCard from './AvoidCard';
import EmergencyCard from './EmergencyCard';
import FestivalsCard from './FestivalsCard';
import NearbyCard from './NearbyCard';
import DestinationHero from './DestinationHero';
import AISnapshot from './AISnapshot';
import CopyButton from './CopyButton';
import type { ParsedSection } from '../../types';

interface MessageRendererProps {
  content: string;
  isStreaming?: boolean;
}

const CARD_COMPONENTS: Record<string, React.ComponentType<{ content: string }>> = {
  overview: TravelOverviewCard,
  timeline: TimelineCard,
  hotels: HotelGrid,
  budget: BudgetCard,
  packing: PackingCard,
  food: FoodCard,
  transport: TransportCard,
  weather: WeatherCard,
  tips: TipsCard,
  experiences: ExperiencesCard,
  hidden_gems: HiddenGemsCard,
  photography: PhotographyCard,
  etiquette: EtiquetteCard,
  avoid: AvoidCard,
  emergency: EmergencyCard,
  festivals: FestivalsCard,
  nearby: NearbyCard,
};

const SECTION_ORDER: Record<string, number> = {
  overview: 3,
  timeline: 4,
  hotels: 5,
  food: 6,
  budget: 7,
  weather: 8,
  packing: 9,
  tips: 10,
  hidden_gems: 11,
  photography: 12,
  festivals: 13,
  etiquette: 14,
  nearby: 15,
  emergency: 16,
  transport: 17,
  avoid: 18,
};

function ProseText({ content }: { content: string }) {
  return (
    <div className="bg-surface border border-border/50 rounded-2xl p-4 shadow-sm">
      <p className="text-body text-night/80 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function calcDelay(content: string): number {
  const len = content.length;
  if (len > 800) return 500;
  if (len > 400) return 350;
  return 200;
}

function MessageRenderer({ content, isStreaming = false }: MessageRendererProps) {
  const prefersReduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0);
  const started = useRef(false);
  // Track whether content was already complete when the component first mounted.
  // If true, this is a conversation loaded from history — skip staggered reveal.
  const wasCompleteOnMount = useRef<boolean | null>(null);

  const isJsonItinerary = useMemo(() => {
    const trimmed = content.trim();
    const clean = trimmed.replace(/^```json\s*/i, '').trim();
    return clean.startsWith('{');
  }, [content]);

  const parsedJson = useMemo(() => {
    if (!isJsonItinerary) return null;
    const clean = content.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(clean);
    } catch {
      return null;
    }
  }, [content, isJsonItinerary]);

  const sections = useMemo(() => {
    if (isJsonItinerary || !content.trim()) return [];
    return parseAiResponse(content);
  }, [content, isJsonItinerary]);

  const { overviewSection, otherSections } = useMemo(() => {
    const overview = sections.find((s) => s.type === 'overview') || null;
    const others = sections.filter((s) => s.type !== 'overview' && s.type !== 'map');
    others.sort((a, b) => {
      const orderA = SECTION_ORDER[a.type] ?? 99;
      const orderB = SECTION_ORDER[b.type] ?? 99;
      return orderA - orderB;
    });
    return { overviewSection: overview, otherSections: others };
  }, [sections]);

  const isStructuredPlan = useMemo(() => {
    return content.includes('## ');
  }, [content]);

  const isComplete = !isStreaming || isJsonItinerary || !isStructuredPlan || content.includes('## Pro Tips') || content.includes('## Emergency Contacts') || content.includes('## Things to Avoid');

  // Capture whether the content was already complete on the very first render.
  // This distinguishes "loaded from conversation history" from "just finished streaming".
  if (wasCompleteOnMount.current === null) {
    wasCompleteOnMount.current = isComplete;
  }

  useEffect(() => {
    if (isJsonItinerary || started.current) return;

    // Still streaming — don't lock `started`, don't reveal yet.
    // The `isPartial` check in the render handles showing raw text during streaming.
    if (!isComplete) return;

    // Content is now complete. Lock `started` so this only fires once.
    started.current = true;

    // If content was already complete when we first mounted (loaded from conversation
    // history, e.g. user switched away and came back), show everything instantly.
    if (wasCompleteOnMount.current || prefersReduced || otherSections.length === 0) {
      setRevealed(otherSections.length);
      return;
    }

    // Content just finished streaming for the first time — play staggered reveal.
    let delay = 400;
    for (let i = 0; i < otherSections.length; i++) {
      const d = delay;
      const idx = i;
      setTimeout(() => setRevealed(idx + 1), d);
      delay += calcDelay(otherSections[i].content);
    }
  }, [isComplete, otherSections, prefersReduced, isJsonItinerary]);

  if (isJsonItinerary) {
    if (parsedJson) {
      return <JsonItineraryDashboard data={parsedJson} />;
    }
    if (!isStreaming) {
      return (
        <div className="bg-surface border border-red-100 rounded-3xl p-6 shadow-md text-left flex flex-col items-center justify-center space-y-4 min-h-[220px]">
          <Compass className="w-10 h-10 text-coral" />
          <div className="space-y-1 text-center">
            <h4 className="font-display text-lg text-night font-light">Unable to render itinerary</h4>
            <p className="text-body text-muted/70">The travel plan response was incomplete or malformed. Please ask me to try regenerating it.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-gradient-to-br from-surface to-[#FDFBF5] border border-border/50 rounded-3xl p-6 shadow-md text-left flex flex-col items-center justify-center space-y-4 min-h-[220px]">
        <Compass className="w-10 h-10 text-gold animate-spin-slow" />
        <div className="space-y-1 text-center">
          <h4 className="font-display text-lg text-night font-light">Crafting your premium itinerary...</h4>
          <p className="text-micro font-mono text-muted/40 uppercase tracking-widest">Designing daily logs & budgets</p>
        </div>
        <div className="w-48 h-1 bg-secondary-surface rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gold rounded-full" 
            animate={{ left: ["-100%", "100%"] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ width: "50%" }}
          />
        </div>
      </div>
    );
  }

  if (sections.length === 0) return null;

  const isPartial = !isComplete;

  if (isPartial && content.length > 50) {
    return (
      <div className="bg-surface border border-border/50 rounded-2xl p-4 shadow-sm">
        <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}<span className="inline-block w-0.5 h-4 bg-gold/40 ml-0.5 animate-pulse" /></p>
      </div>
    );
  }

  const overviewContent = overviewSection?.content || '';

  return (
    <motion.div
      className="space-y-6"
      initial={prefersReduced ? undefined : "hidden"}
      animate={prefersReduced ? undefined : "visible"}
    >
      {overviewContent && (
        <>
          <DestinationHero content={overviewContent} />
          <AISnapshot content={overviewContent} />
        </>
      )}

      {otherSections.slice(0, revealed).map((section, idx) => {
        const Card = CARD_COMPONENTS[section.type] || ProseText;
        return (
          <motion.div
            key={`${section.type}-${idx}`}
            initial={prefersReduced ? undefined : { opacity: 0, y: 6 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            transition={prefersReduced ? undefined : { duration: 0.2, ease: 'easeOut' }}
            id={`section-${section.type}`}
            className="group relative"
            style={{ scrollMarginTop: '80px' }}
          >
            <Card content={section.content} />
            {section.type !== 'unknown' && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <CopyButton text={section.content} label={`Copy ${section.title || section.type}`} />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default memo(MessageRenderer);
