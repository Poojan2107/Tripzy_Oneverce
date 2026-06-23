import { Utensils, Plane, Home, Compass } from 'lucide-react';

export default function ServiceIcon({ iconName }: { iconName: string }) {
  const cn = "w-5 h-5 text-ocean";
  switch (iconName) {
    case 'Utensils': return <Utensils className={cn} />;
    case 'Plane': return <Plane className={cn} />;
    case 'Home': return <Home className={cn} />;
    default: return <Compass className={cn} />;
  }
}
