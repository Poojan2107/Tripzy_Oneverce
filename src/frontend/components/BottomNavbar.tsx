import { Compass, Search, Map, Sparkles, Heart } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  wishlistCount: number;
  visible?: boolean;
}

export default function BottomNavbar({
  currentTab,
  onTabChange,
  wishlistCount,
  visible = true
}: BottomNavbarProps) {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Compass },
    { id: 'explore' as TabType, label: 'Explore', icon: Search },
    { id: 'ai-planner' as TabType, label: 'Planner', icon: Sparkles },
    { id: 'saved' as TabType, label: 'Passport', icon: Heart, badge: wishlistCount },
  ];

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:hidden select-none transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-lg shadow-elevated border border-warm-gray">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative py-1.5 px-3 flex flex-col items-center justify-center transition-all duration-200 rounded-xl cursor-pointer"
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? 'text-ocean stroke-[2]'
                    : 'text-stone hover:text-charcoal/60'
                }`}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 transition-all duration-200 ${
                  isActive ? 'text-night font-bold' : 'text-stone font-medium'
                }`}
              >
                {tab.label === 'Saved' ? 'Saved' : tab.label.split(' ')[0]}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-0.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-ocean px-1 text-[7px] font-bold text-white ring-2 ring-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
