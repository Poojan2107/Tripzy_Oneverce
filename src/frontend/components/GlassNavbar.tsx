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
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
 
  useEffect(() => {
    setMounted(true);
    const handleScrollSpy = () => {
      const sections = ['home', 'explore', 'saved', 'ai-planner'];
      const scrollPos = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
 
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-hide when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
 
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = !scrolled;

  const getNavContainerClass = () => {
    if (isTransparent) {
      return 'fixed top-0 left-0 w-full z-50 bg-transparent py-3 px-6 transition-all duration-300';
    }
    return 'fixed top-0 left-0 w-full z-50 bg-night/80 backdrop-blur-xl border-b border-white/10 py-2.5 px-6 transition-all duration-300';
  };
  
  const getInnerClass = () => {
    return isTransparent ? 'text-white py-1.5' : 'text-white py-1.5';
  };
  
  return (
    <motion.nav
      className={`${getNavContainerClass()} hidden md:block select-none`}
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: mounted ? (visible ? 1 : 0) : 0,
        y: mounted ? (visible ? 0 : -80) : -10
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 ${getInnerClass()}`}
        layout
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.button onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 btn-ghost cursor-pointer group shrink-0 min-h-[44px]"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <motion.div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-gold ${isTransparent ? 'bg-white/20 text-white' : 'bg-white/15 text-white'}`}
            whileHover={{ rotate: 12 }}>
            <Compass className="w-4 h-4 stroke-[1.5] animate-spin-slow" />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className={`font-logo text-card font-bold tracking-tight lowercase leading-none ${isTransparent ? 'text-white' : 'text-white'}`}>
              travebie<span className="text-gold">.ai</span>
            </span>
            <span className={`text-meta font-mono uppercase tracking-[0.2em] mt-0.5 scale-90 origin-left ${isTransparent ? 'text-white/60' : 'text-white/50'}`}>Atlas Vivant</span>
          </div>
        </motion.button>
 
        <motion.div className="flex items-center gap-3 shrink-0" layout>
          {/* Passport Button next to Sign In/Out */}
          <motion.button
            onClick={() => onTabChange('saved')}
            className={`relative px-3.5 py-2 rounded-md btn-ghost text-caption font-bold flex items-center gap-2 cursor-pointer min-h-[38px] ${
              currentTab === 'saved'
                ? 'text-gold bg-white/10 border border-white/20 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <BookOpen className={`w-4 h-4 ${currentTab === 'saved' ? 'text-gold scale-110' : ''}`} />
            <span>Passport</span>
            {wishlistCount > 0 && (
              <motion.span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-meta font-bold text-white"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                {wishlistCount}
              </motion.span>
            )}
            {currentTab === 'saved' && (
              <motion.span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full ${isTransparent ? 'bg-gold shadow-[0_0_6px_rgba(244,182,61,0.8)]' : 'bg-gold'}`}
                layoutId="navActiveIndicator" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
            )}
          </motion.button>
 
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
                className="px-3 py-2 btn-ghost cursor-pointer flex items-center justify-center gap-1.5 text-meta font-bold text-white/70 hover:text-rose-400 hover:bg-white/10"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </motion.button>
            </div>
          ) : (
            <motion.button onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-md text-meta font-bold cursor-pointer border border-white/30 text-white hover:bg-white/10 transition-all duration-200"
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