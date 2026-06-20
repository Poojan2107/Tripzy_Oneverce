import { useState, useEffect, useRef } from 'react';
import { Compass, Search, Map, Sparkles, Heart, User, ArrowRight, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { TabType } from '../types';

interface GlassNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSearchClick: () => void;
  wishlistCount: number;
  isAuthenticated?: boolean;
}

export default function GlassNavbar({
  currentTab,
  onTabChange,
  onSearchClick,
  wishlistCount,
  isAuthenticated = false
}: GlassNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
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
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 border-none bg-transparent"
        >
          <div className="w-9 h-9 rounded-full bg-night flex items-center justify-center text-white transition-all duration-500 group-hover:bg-gold group-hover:scale-110">
            <Compass className="w-4.5 h-4.5 stroke-[1.5] animate-spin-slow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[22px] font-bold text-night tracking-tight lowercase leading-none">
              tripzy<span className="text-gold">.ai</span>
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-night/35 leading-none mt-0.5">Atlas Vivant</span>
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
                className={`relative px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 flex items-center gap-2 cursor-pointer ${
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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg text-muted hover:text-night hover:bg-sand transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-night text-white text-[11px] font-bold uppercase tracking-wide hover:bg-gold transition-all duration-300 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden lg:block">{session.user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 rounded-xl bg-warm-white border border-warm-gray shadow-[0_8px_24px_rgba(30,41,59,0.1)] overflow-hidden z-50">
                  {session.user?.email?.endsWith('@tripzy.ai') && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-[11px] font-medium text-night hover:bg-sand transition-colors">
                      <Shield className="w-3.5 h-3.5 text-gold" />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-[11px] font-medium text-night hover:bg-sand transition-colors">
                    <User className="w-3.5 h-3.5" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-t border-warm-gray"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-night text-white text-[11px] font-bold uppercase tracking-wide hover:bg-gold transition-all duration-300"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
