"use client";
import { parseAiResponse } from '../../lib/parseAiResponse';
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

export default function MessageRenderer({ content }: MessageRendererProps) {
  if (!content.trim()) return null;

  const sections = parseAiResponse(content);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const Card = CARD_COMPONENTS[section.type] || ProseText;
        return <Card key={idx} content={section.content} />;
      })}
    </div>
  );
}
