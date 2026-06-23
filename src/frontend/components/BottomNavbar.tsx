import { Compass, Search, Sparkles, Heart, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isDarkPage = currentTab !== 'home';

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Compass },
    { id: 'explore' as TabType, label: 'Explore', icon: Search },
    { id: 'saved' as TabType, label: 'Discover', icon: Heart, badge: wishlistCount },
    { id: 'ai-planner' as TabType, label: 'Planner', icon: Sparkles },
    ...(isAdmin ? [{ id: 'admin' as TabType, label: 'Admin', icon: Shield, href: '/admin' }] : []),
  ];

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm md:hidden select-none transition-all duration-300 pb-[env(safe-area-inset-bottom,8px)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className={`flex items-center justify-around py-2.5 px-3 rounded-2xl backdrop-blur-lg shadow-elevated border transition-all duration-300 ${
        isDarkPage
          ? 'bg-[#0C2533]/95 border-white/10 text-white'
          : 'bg-white/95 border-warm-gray text-night'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => tab.href ? window.location.href = tab.href : onTabChange(tab.id)}
              className="relative py-2 px-3 flex flex-col items-center justify-center transition-all duration-200 rounded-xl cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? isDarkPage ? 'text-gold scale-110' : 'text-ocean stroke-[2]'
                    : isDarkPage ? 'text-white/40 hover:text-white' : 'text-stone hover:text-charcoal/60'
                }`}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 transition-all duration-200 ${
                  isActive 
                    ? isDarkPage ? 'text-white font-bold' : 'text-night font-bold'
                    : isDarkPage ? 'text-white/40 font-medium' : 'text-stone font-medium'
                }`}
              >
                {tab.label}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`absolute -top-0.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white ring-2 ${
                  isDarkPage ? 'bg-gold ring-[#0C2533]' : 'bg-ocean ring-white'
                }`}>
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
