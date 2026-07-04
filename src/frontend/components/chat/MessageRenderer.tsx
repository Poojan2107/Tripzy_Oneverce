"use client";
import { useState, useMemo, useCallback, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { parseAiResponse } from '../../lib/parseAiResponse';
import { extractPlaces } from '../../lib/placeData';
import TravelOverviewCard from './TravelOverviewCard';
import TimelineCard from './TimelineCard';
import HotelGrid from './HotelGrid';
import BudgetCard from './BudgetCard';
import MapCard from './MapCard';
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
import CopyButton from './CopyButton';
import type { MapMarker } from './MapView';

interface MessageRendererProps {
  content: string;
}

const CARD_COMPONENTS: Record<string, React.ComponentType<{ content: string }>> = {
  overview: TravelOverviewCard,
  timeline: TimelineCard,
  hotels: HotelGrid,
  budget: BudgetCard,
  map: MapCard,
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

function ProseText({ content }: { content: string }) {
  return (
    <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-sm">
      <p className="text-body text-night/80 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function MessageRenderer({ content }: MessageRendererProps) {
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const staggerItem = useMemo(() => ({
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.25, delay: prefersReduced ? 0 : i * 0.03, ease: 'easeOut' as const },
    }),
  }), [prefersReduced]);

  const sections = useMemo(() => {
    if (!content.trim()) return [];
    return parseAiResponse(content);
  }, [content]);

  const markers: MapMarker[] = useMemo(() => {
    const result: MapMarker[] = [];
    const seen = new Set<string>();
    sections.forEach((section) => {
      if (section.type === 'unknown' || section.type === 'map') return;
      const places = extractPlaces(section.content);
      places.forEach((place) => {
        const key = `${place.lat.toFixed(2)}_${place.lng.toFixed(2)}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            id: `${section.type}_${place.name}`,
            name: place.name,
            lat: place.lat,
            lng: place.lng,
            sectionType: section.type,
          });
        }
      });
    });
    return result;
  }, [sections]);

  const handlePinClick = useCallback((sectionType: string) => {
    const el = document.getElementById(`section-${sectionType}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightedSection(sectionType);
  }, []);

  const handleSectionHover = useCallback((sectionType: string | null) => {
    setHighlightedSection(sectionType);
  }, []);

  if (sections.length === 0) return null;

  // During streaming, show raw text for sections still being written
  const isPartial = sections.length > 0 && !content.includes('## Pro Tips');

  if (isPartial && content.length > 50) {
    return (
      <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-sm">
        <p className="text-body text-muted/70 leading-relaxed whitespace-pre-wrap">{content}<span className="inline-block w-0.5 h-4 bg-gold/40 ml-0.5 animate-pulse" /></p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
    >
      {markers.length > 0 && (
        <div id="section-map">
          <MapCard
            content=""
            markers={markers}
            onPinClick={handlePinClick}
            highlightedSection={highlightedSection}
          />
        </div>
      )}

      {sections.map((section, idx) => {
        const Card = CARD_COMPONENTS[section.type] || ProseText;
        const sectionIndex = markers.length > 0 ? idx + 1 : idx;
        const isHighlighted = highlightedSection === section.type;

        return (
          <motion.div
            key={idx}
            custom={sectionIndex}
            variants={staggerItem}
            id={`section-${section.type}`}
            onMouseEnter={() => handleSectionHover(section.type)}
            onMouseLeave={() => handleSectionHover(null)}
            className={`group relative rounded-2xl transition-all duration-300 ${
              isHighlighted ? 'ring-2 ring-gold/30 shadow-lg' : ''
            }`}
            style={{ scrollMarginTop: '80px' }}
          >
            <Card content={section.content} />
            {section.type !== 'map' && section.type !== 'unknown' && (
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
