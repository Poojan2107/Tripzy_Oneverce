"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Search, Sparkles, BookOpen, LogIn, LogOut, Shield } from 'lucide-react';
import { TabType } from '../types';
import { useSession, signIn, signOut } from 'next-auth/react';

interface GlassNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSearchClick: () => void;
  wishlistCount: number;
}

export default function GlassNavbar({
  currentTab, onTabChange, onSearchClick, wishlistCount
}: GlassNavbarProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = currentTab === 'home' && !scrolled;

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Compass },
    { id: 'explore' as TabType, label: 'Atlas', icon: Search },
    { id: 'saved' as TabType, label: 'Passport', icon: BookOpen, badge: wishlistCount },
    { id: 'ai-planner' as TabType, label: 'Companion', icon: Sparkles },
  ];

  const getNavContainerClass = () => {
    if (isTransparent) return 'absolute top-0 left-0 w-full z-50 bg-transparent py-3 px-6';
    return 'sticky top-0 z-50 bg-[#F8F4EE]/80 backdrop-blur-lg border-b border-warm-gray/30 py-2 px-6';
  };

  const getInnerClass = () => {
    if (isTransparent) return 'bg-white/[0.07] backdrop-blur-[12px] border-white/10 text-white py-2.5';
    return 'bg-white/95 border-warm-gray/40 shadow-sm text-night py-2';
  };

  return (
    <motion.nav
      className={`${getNavContainerClass()} hidden md:block select-none`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 rounded-2xl border ${getInnerClass()}`}
        layout
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.button onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 border-none bg-transparent min-h-[44px]"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <motion.div className="w-9 h-9 rounded-full bg-night flex items-center justify-center text-white group-hover:bg-gold group-hover:scale-110 transition-all duration-500"
            whileHover={{ rotate: 10 }}>
            <Compass className="w-4.5 h-4.5 stroke-[1.5] animate-spin-slow" />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className={`font-display text-[22px] font-bold tracking-tight lowercase leading-tight ${isTransparent ? 'text-white' : 'text-night'}`}>
              tripzy<span className="text-gold">.ai</span>
            </span>
            <span className={`text-[8px] font-mono uppercase tracking-[0.2em] mt-0.5 ${isTransparent ? 'text-white/60' : 'text-night/60'}`}>Atlas Vivant</span>
          </div>
        </motion.button>

        <motion.div className={`flex items-center gap-0.5 rounded-lg px-1 py-1 border ${
          isTransparent ? 'bg-white/[0.06] border-white/10' : 'bg-[#F2ECE3]/60 border-warm-gray/30'
        }`} layout>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => onTabChange(tab.id)} layout
                className={`relative px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] flex items-center gap-2 cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'text-gold bg-transparent border-none'
                    : isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-muted/80 hover:text-night hover:bg-[#F2ECE3]'
                }`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'text-gold scale-110' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <motion.span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-white"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    {tab.badge}
                  </motion.span>
                )}
                {isActive && (
                  <motion.span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-gold rounded-full"
                    layoutId="navActiveIndicator" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div className="flex items-center gap-3 shrink-0" layout>
          <motion.button onClick={onSearchClick}
            className={`p-3 rounded-lg transition-colors cursor-pointer ${
              isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-muted/80 hover:text-night hover:bg-[#F2ECE3]'
            }`}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Search className="w-4 h-4" />
          </motion.button>

          <div className={`h-4 w-px ${isTransparent ? 'bg-white/20' : 'bg-warm-gray/50'}`} />

          {session ? (
            <div className="flex items-center gap-3.5">
              {isAdmin && (
                <motion.a href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isTransparent ? 'border-gold/50 bg-gold/10 text-gold' : 'border-gold/30 bg-gold/5 text-gold'}`}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </motion.a>
              )}
              <motion.div className="relative group"
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-2 cursor-pointer">
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} loading="lazy"
                      className={`w-7 h-7 rounded-full object-cover border transition-all group-hover:ring-2 group-hover:ring-gold/50 ${isTransparent ? 'border-white/30' : 'border-warm-gray/50'}`} />
                  ) : (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all group-hover:ring-2 group-hover:ring-gold/50 ${
                      isTransparent ? 'bg-white/20 text-white border-white/30' : 'bg-night text-white border-warm-gray/50'
                    }`}>
                      {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.button onClick={() => signOut()}
                className={`min-w-[44px] min-h-[44px] px-2 rounded-lg cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                  isTransparent ? 'text-white/70 hover:text-rose-400 hover:bg-white/10'
                    : 'text-muted/80 hover:text-rose-500 hover:bg-rose-50'
                }`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </motion.button>
            </div>
          ) : (
            <motion.button onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer min-h-[38px] ${
                isTransparent ? 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm' : 'bg-night text-white hover:bg-gold hover:text-night'
              }`}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}