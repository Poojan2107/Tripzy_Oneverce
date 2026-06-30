"use client";
import { motion } from 'framer-motion';
import { Compass, Search, Sparkles, BookOpen, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TabType } from '../types';

interface BottomNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  wishlistCount: number;
  visible?: boolean;
}

export default function BottomNavbar({ currentTab, onTabChange, wishlistCount, visible = true }: BottomNavbarProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Compass },
    { id: 'explore' as TabType, label: 'Atlas', icon: Search },
    { id: 'saved' as TabType, label: 'Passport', icon: BookOpen, badge: wishlistCount },
    { id: 'ai-planner' as TabType, label: 'Companion', icon: Sparkles },
    ...(isAdmin ? [{ id: 'admin' as TabType, label: 'Admin', icon: Shield, href: '/admin' }] : []),
  ];

  return (
    <motion.div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm md:hidden pb-[var(--safe-bottom)]`}
      animate={visible ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <div className="flex items-center justify-around py-2 px-3 rounded-lg backdrop-blur-lg shadow-lg border bg-white/95 border-border/40 text-night">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <motion.button key={tab.id}
              onClick={() => tab.href ? window.location.href = tab.href : onTabChange(tab.id)}
              className="relative py-1.5 px-2.5 flex flex-col items-center justify-center btn-ghost cursor-pointer min-h-[44px] min-w-[44px]"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? 'text-gold' : 'text-muted/50'
                }`} />
              </motion.div>
              <span className={`text-meta font-bold mt-1 transition-colors ${
                isActive ? 'text-night font-bold' : 'text-muted/50'
              }`}>
                {tab.label}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <motion.span className="absolute top-1 right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold px-1 text-meta font-bold text-white scale-90"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  {tab.badge}
                </motion.span>
              )}
              {isActive && (
                <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold"
                  layoutId="bottomNavIndicator" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
