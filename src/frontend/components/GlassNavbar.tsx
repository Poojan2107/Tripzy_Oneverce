"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Search, Sparkles, BookOpen, LogIn, LogOut, Shield } from 'lucide-react';
import { TabType } from '../types';
import { useSession, signIn, signOut } from 'next-auth/react';
import SafeImage from './ui/SafeImage';

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
    if (isTransparent) return 'absolute top-0 left-0 w-full z-50 bg-transparent py-4 px-6';
    return 'sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20 py-2.5 px-6';
  };
 
  const getInnerClass = () => {
    if (isTransparent) return 'bg-white/[0.07] backdrop-blur-[12px] border-white/10 text-white py-2';
    return 'bg-white border-border/40 shadow-md text-night py-1.5';
  };
 
  return (
    <motion.nav
      className={`${getNavContainerClass()} hidden md:block select-none`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 rounded-lg border ${getInnerClass()}`}
        layout
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.button onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 btn-ghost cursor-pointer group shrink-0 min-h-[44px]"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <motion.div className="w-8.5 h-8.5 rounded-full bg-night flex items-center justify-center text-white group-hover:bg-gold transition-all duration-500"
            whileHover={{ rotate: 12 }}>
            <Compass className="w-4 h-4 stroke-[1.5] animate-spin-slow" />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className={`font-logo text-card font-bold tracking-tight lowercase leading-none ${isTransparent ? 'text-white' : 'text-night'}`}>
              travebie<span className="text-gold">.ai</span>
            </span>
            <span className={`text-meta font-mono uppercase tracking-[0.2em] mt-0.5 scale-90 origin-left ${isTransparent ? 'text-white/60' : 'text-night/60'}`}>Atlas Vivant</span>
          </div>
        </motion.button>
 
        <motion.div className={`flex items-center gap-0.5 rounded-md px-1 py-1 border ${
          isTransparent ? 'bg-white/[0.06] border-white/10' : 'bg-secondary-surface/60 border-border/40'
        }`} layout>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => onTabChange(tab.id)} layout
                className={`relative px-4.5 py-2 btn-ghost text-caption font-bold flex items-center gap-2 cursor-pointer min-h-[38px] ${
                  isActive
                    ? 'text-gold bg-transparent'
                    : isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-muted hover:text-night hover:bg-secondary-surface'
                }`}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-gold scale-110' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <motion.span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-meta font-bold text-white"
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
            className={`p-2.5 btn-ghost rounded-md transition-colors cursor-pointer ${
              isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-muted hover:text-night hover:bg-secondary-surface'
            }`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Search className="w-4 h-4" />
          </motion.button>
 
          <div className={`h-4 w-px ${isTransparent ? 'bg-white/20' : 'bg-border/50'}`} />
 
          {session ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <motion.a href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-caption font-bold ${isTransparent ? 'border-gold/50 bg-gold/10 text-gold' : 'border-gold/30 bg-gold/5 text-gold'}`}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </motion.a>
              )}
              <motion.div className="relative group"
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-2 cursor-pointer">
                  {session.user.image ? (
                    <SafeImage
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="rounded-full object-cover border border-border/50 transition-all group-hover:ring-2 group-hover:ring-gold/30"
                    />
                  ) : (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold border border-border/50 transition-all group-hover:ring-2 group-hover:ring-gold/30 ${
                      isTransparent ? 'bg-white/20 text-white' : 'bg-night text-white'
                    }`}>
                      {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.button onClick={() => signOut()}
                className={`px-3 py-2 btn-ghost cursor-pointer flex items-center justify-center gap-1.5 text-meta font-bold ${
                  isTransparent ? 'text-white/70 hover:text-rose-400 hover:bg-white/10'
                    : 'text-muted hover:text-rose-500 hover:bg-rose-50'
                }`}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </motion.button>
            </div>
          ) : (
            <motion.button onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-md text-meta font-bold cursor-pointer ${
                isTransparent ? 'btn-ghost' : 'btn-night'
              }`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}