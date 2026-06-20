import { useState, useEffect } from 'react';
import { Compass, Search, Map, Sparkles, Heart, LogIn, LogOut, Shield } from 'lucide-react';
import { TabType } from '../types';
import { useSession, signIn, signOut } from 'next-auth/react';

interface GlassNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSearchClick: () => void;
  wishlistCount: number;
}

export default function GlassNavbar({
  currentTab,
  onTabChange,
  onSearchClick,
  wishlistCount
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

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Compass },
    { id: 'explore' as TabType, label: 'Explore Atlas', icon: Search },
    { id: 'ai-planner' as TabType, label: 'Journey Builder', icon: Sparkles },
    { id: 'saved' as TabType, label: 'Passport', icon: Heart, badge: wishlistCount },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 hidden md:block select-none px-6 py-3 transition-all duration-500 ${
        mounted ? 'animate-page-enter' : 'opacity-0'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-400 ${
          scrolled
            ? 'bg-warm-white border-warm-gray/80 shadow-card'
            : 'bg-warm-white/95 border-warm-gray/40 shadow-soft'
        }`}
      >
        {/* Logo — Brand Signature */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 border-none bg-transparent min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-full bg-night flex items-center justify-center text-white transition-all duration-500 group-hover:bg-gold group-hover:scale-110">
            <Compass className="w-4.5 h-4.5 stroke-[1.5] animate-spin-slow" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display text-[22px] font-bold text-night tracking-tight lowercase leading-tight">
              tripzy<span className="text-gold">.ai</span>
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-night/60 mt-0.5">Atlas Vivant</span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-0.5 bg-sand/60 rounded-xl px-1.5 py-1.5 border border-warm-gray/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 flex items-center gap-2 cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'text-gold bg-white shadow-sm border border-warm-gray/60'
                    : 'text-muted hover:text-night hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isActive ? 'text-gold scale-110' : ''
                }`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg text-muted hover:text-night hover:bg-sand transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-warm-gray/60" />

          {session ? (
            <div className="flex items-center gap-3.5">
              {isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/30 bg-gold/5 text-gold text-[10px] font-bold uppercase tracking-wider hover:bg-gold/15 transition-all animate-fade-in"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </a>
              )}
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-7 h-7 rounded-full object-cover border border-warm-gray"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-night flex items-center justify-center text-white text-[11px] font-bold border border-warm-gray">
                  {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-night text-white hover:bg-saffron text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
