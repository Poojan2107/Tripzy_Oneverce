"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, MessageSquarePlus, Bookmark, Heart, User, Settings, LogOut, LogIn, X, Menu,
} from 'lucide-react';
import type { Conversation } from '../../types';
import ConversationHistory from './ConversationHistory';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentMode: 'chat' | 'profile';
  wishlistCount: number;
  session: any;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onShowProfile: () => void;
  onShowChat: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onBackToHome: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  conversations, activeConversationId, currentMode, wishlistCount,
  session, onNewChat, onSelectConversation, onDeleteConversation,
  onShowProfile, onShowChat, onSignIn, onSignOut, onBackToHome,
  mobileOpen = false, setMobileOpen,
}: SidebarProps) {
  const closeMobile = () => setMobileOpen?.(false);

  const navItems = (
    <>
      {/* Logo + New Chat */}
      <div className="px-4 pt-5 pb-3 space-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold animate-spin-slow" />
            <span className="font-logo text-lg text-white lowercase tracking-tight">travebie<span className="text-gold">.ai</span></span>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer -mr-1"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => { onNewChat(); closeMobile(); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/5 hover:border-gold/40 transition-all duration-200 cursor-pointer text-caption font-bold tracking-wider shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 text-gold" />
          New Chat
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        <ConversationHistory
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={(id) => { onSelectConversation(id); closeMobile(); }}
          onDelete={onDeleteConversation}
        />
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-6 pt-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => { onShowProfile(); closeMobile(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
            currentMode === 'profile' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-caption font-bold tracking-wider flex-1 text-left">Saved Journeys</span>
          {wishlistCount > 0 && (
            <span className="text-micro px-1.5 py-0.5 rounded-full bg-gold/20 text-gold font-mono">{wishlistCount}</span>
          )}
        </button>
        <button
          onClick={() => { onShowProfile(); closeMobile(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <Heart className="w-4 h-4" />
          <span className="text-caption font-bold tracking-wider">Wishlist</span>
        </button>
        <button
          onClick={() => { onShowProfile(); closeMobile(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
            currentMode === 'profile' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-caption font-bold tracking-wider flex-1 text-left">Profile</span>
        </button>
        <button
          onClick={() => { onBackToHome(); closeMobile(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-gold" />
          <span className="text-caption font-bold tracking-wider flex-1 text-left">Back to Home</span>
        </button>
        <div className="pt-2">
          {session ? (
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-coral hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-caption font-bold tracking-wider">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-caption font-bold tracking-wider">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-night/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[300px] flex flex-col bg-gradient-to-b from-[#091118] via-[#0E1B26] to-[#122230] border-r border-white/10 shadow-2xl lg:hidden pt-[env(safe-area-inset-top)]"
            style={{ willChange: 'transform' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          >
            {navItems}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] xl:w-[300px] shrink-0 h-full bg-gradient-to-b from-[#091118] via-[#0E1B26] to-[#122230] border-r border-white/10 shadow-lg">
        {navItems}
      </aside>
    </>
  );
}
