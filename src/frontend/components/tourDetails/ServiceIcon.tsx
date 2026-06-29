"use client";
import { motion } from 'framer-motion';
import { Utensils, Plane, Home, Compass } from 'lucide-react';

export default function ServiceIcon({ iconName }: { iconName: string }) {
  const cn = "w-5 h-5 text-teal";
  const icon = (() => {
    switch (iconName) {
      case 'Utensils': return <Utensils className={cn} />;
      case 'Plane': return <Plane className={cn} />;
      case 'Home': return <Home className={cn} />;
      default: return <Compass className={cn} />;
    }
  })();

  return (
    <motion.span
      className="inline-flex"
      whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
      transition={{ duration: 0.4 }}
    >
      {icon}
    </motion.span>
  );
}
