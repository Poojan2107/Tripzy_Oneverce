"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Conversation, ChatMessage, Tour } from '../../types';
import { Compass, Share2, Download, Menu, BookOpen, LogIn, LogOut } from 'lucide-react';
import ChatContext from './ChatContext';
import EmptyState from './EmptyState';
import ConversationView from './Conversation';
import { detectIntent } from '../../lib/intentDetector';
import { savePreferences, loadPreferences, clearPreferences } from '../../lib/preferenceStore';
import type { SavedPreferences } from '../../lib/preferenceStore';
import { findLocation } from '../../lib/placeData';
import { useToast } from '../ui/Toast';

interface ChatViewProps {
  tours: Tour[];
  wishlistIds: string[];
  savedItineraries: any[];
  onToggleWishlist: (tourId: string) => void;
  onSaveItinerary: (itin: any, skipRedirect?: boolean) => void;
  onDeleteItinerary: (itinId: string) => void;
  onShowTourDetail: (tour: Tour) => void;
  externalConversations?: Conversation[];
  externalActiveId?: string | null;
  onConversationsChange?: (convs: Conversation[]) => void;
  onActiveConversationChange?: (id: string | null) => void;
  pendingPrompt?: string | null;
  onClearPendingPrompt?: () => void;
  onToggleSidebar?: () => void;
  session?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onShowPassport?: () => void;
}

const STORAGE_KEY = 'travebie_conversations';
const MAX_CONVERSATIONS = 50;

function loadConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, MAX_CONVERSATIONS)));
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, 20)));
    } catch {}
  }
}

function generateTitle(content: string, userPrompt?: string): string | null {
  if (!content.trim()) return null;

  // 1. Try parsing JSON response hero.destination first (fastest, most accurate)
  try {
    const trimmed = content.trim();
    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      if (parsed?.hero?.destination) {
        const dest = parsed.hero.destination as string;
        const tripDuration = parsed.hero.tripDuration || '';
        const durationMatch = tripDuration.match(/(\d+)/);
        const days = durationMatch ? `${durationMatch[1]}-Day` : '';
        return [days, dest].filter(Boolean).join(' ').slice(0, 50);
      }
    }
  } catch {
    // Not JSON, continue to text parsing
  }

  // 2. Try finding location in user's prompt first (more reliable)
  const scanText = userPrompt || content;
  const lower = scanText.toLowerCase();
  const dest = findLocation(scanText);
  const destination = dest?.name || null;

  const intentPatterns: [RegExp, string][] = [
    [/\b(?:honeymoon|romantic|couple)\b/i, 'Romantic'],
    [/\bsolo\b/i, 'Solo'],
    [/\b(?:backpacking|backpacker)\b/i, 'Backpacking'],
    [/\bluxury|premium\b/i, 'Luxury'],
    [/\bfamily\b/i, 'Family'],
    [/\bweekend|getaway\b/i, 'Weekend'],
    [/\bpilgrimage|pilgrim|spiritual\b/i, 'Pilgrimage'],
    [/\badventure|trek|rafting\b/i, 'Adventure'],
    [/\broad\s*trip|drive\b/i, 'Road Trip'],
    [/\bbudget|budget.?friendly\b/i, 'Budget'],
  ];

  let intent: string | null = null;
  for (const [re, label] of intentPatterns) {
    if (re.test(lower)) { intent = label; break; }
  }

  const durationMatch = scanText.match(/\b(\d+)[- ]day\b/i);
  const duration = durationMatch?.[1] || null;

  const parts: string[] = [];
  if (intent && intent !== 'Weekend') parts.push(intent);
  if (duration && duration !== 'Weekend') parts.push(`${duration}-Day`);
  if (destination) parts.push(destination);

  if (parts.length > 0) return parts.join(' ').slice(0, 50);

  // 3. Fallback: scan full content for location
  const destFromContent = findLocation(content);
  if (destFromContent?.name) return destFromContent.name.slice(0, 50);

  const overviewMatch = content.toLowerCase().match(/journey overview/);
  if (overviewMatch) {
    const idx = content.toLowerCase().indexOf('journey overview');
    const after = content.slice(idx + 16).split('\n')[0]?.trim();
    if (after && after.length < 50) return after.slice(0, 50);
  }

  return null;
}

function mergeItineraryPatch(current: any, patch: any): any {
  if (!current) return patch;
  if (!patch) return current;

  const merged = { ...current };

  if (patch.hero) {
    merged.hero = { ...merged.hero, ...patch.hero };
  }

  if (patch.overview) {
    merged.overview = { ...merged.overview, ...patch.overview };
  }

  if (patch.route) {
    merged.route = { ...merged.route, ...patch.route };
  }

  if (patch.days && Array.isArray(patch.days)) {
    if (!merged.days) merged.days = [];
    
    const daysMap = new Map<number, any>();
    merged.days.forEach((d: any) => {
      if (d && typeof d.day === 'number') {
        daysMap.set(d.day, d);
      }
    });

    patch.days.forEach((patchDay: any) => {
      if (!patchDay || typeof patchDay.day !== 'number') return;
      const existingDay = daysMap.get(patchDay.day);
      if (existingDay) {
        const mergedDay = { ...existingDay };
        
        if (patchDay.title !== undefined) mergedDay.title = patchDay.title;
        if (patchDay.weather !== undefined) mergedDay.weather = patchDay.weather;

        if (patchDay.morning) mergedDay.morning = patchDay.morning;
        if (patchDay.afternoon) mergedDay.afternoon = patchDay.afternoon;
        if (patchDay.evening) mergedDay.evening = patchDay.evening;
        if (patchDay.fuelStops) mergedDay.fuelStops = patchDay.fuelStops;
        if (patchDay.aiTips) mergedDay.aiTips = patchDay.aiTips;

        if (patchDay.restaurants) mergedDay.restaurants = patchDay.restaurants;
        if (patchDay.hotels) mergedDay.hotels = patchDay.hotels;
        if (patchDay.places) mergedDay.places = patchDay.places;

        daysMap.set(patchDay.day, mergedDay);
      } else {
        daysMap.set(patchDay.day, patchDay);
      }
    });

    merged.days = Array.from(daysMap.values()).sort((a: any, b: any) => a.day - b.day);
  }

  if (patch.expenseCalculator) {
    merged.expenseCalculator = { ...merged.expenseCalculator, ...patch.expenseCalculator };
  }

  if (patch.packingChecklist) merged.packingChecklist = patch.packingChecklist;
  if (patch.localFoods) merged.localFoods = patch.localFoods;
  if (patch.shoppingPlaces) merged.shoppingPlaces = patch.shoppingPlaces;

  if (patch.emergencyContacts) {
    merged.emergencyContacts = { ...merged.emergencyContacts, ...patch.emergencyContacts };
  }

  if (patch.faqs) {
    merged.faqs = patch.faqs;
  }

  if (merged.hero?.tripDuration) {
    const durationMatch = merged.hero.tripDuration.match(/(\d+)\s*Day/i);
    if (durationMatch) {
      const daysCount = parseInt(durationMatch[1], 10);
      if (merged.days.length > daysCount) {
        merged.days = merged.days.slice(0, daysCount);
      }
    }
  }

  return merged;
}

export default function ChatView(props: ChatViewProps) {
  const {
    externalConversations, externalActiveId,
    onConversationsChange, onActiveConversationChange,
    onToggleSidebar,
    session,
    onSignIn,
    onSignOut,
    onShowPassport,
    ...passThroughProps
  } = props;

  const isControlled = !!externalConversations;
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);
  const [localActiveId, setLocalActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState<SavedPreferences>({});

  const conversations = isControlled ? externalConversations! : localConversations;
  const setConversations = isControlled
    ? (fn: Conversation[] | ((prev: Conversation[]) => Conversation[])) => {
        if (typeof fn === 'function') {
          (onConversationsChange as (c: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void)(fn);
        } else {
          onConversationsChange?.(fn);
        }
      }
    : setLocalConversations;
  const activeConversationId = isControlled ? externalActiveId! : localActiveId;
  const setActiveConversationId = isControlled
    ? (id: string | null) => onActiveConversationChange?.(id)
    : setLocalActiveId;

  const pendingPromptRef = useRef<string | null>(null);
  useEffect(() => {
    const pp = passThroughProps.pendingPrompt;
    if (pp && pp !== pendingPromptRef.current) {
      pendingPromptRef.current = pp;
      handleSubmit(pp);
      props.onClearPendingPrompt?.();
    }
  }, [passThroughProps.pendingPrompt, props.onClearPendingPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    setSavedPrefs(loadPreferences());
  }, []);

  useEffect(() => {
    if (!isControlled) {
      const saved = loadConversations();
      setLocalConversations(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isControlled && conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations, isControlled]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConv?.messages || [];
  const showEmpty = messages.length === 0 && !isStreaming;

  const hasPrefs = savedPrefs.budgetTier || savedPrefs.travelerType || savedPrefs.destination;
  const { toast } = useToast();

  // Extract and save preferences from a user message
  const extractAndSavePrefs = useCallback((text: string) => {
    const ctx = detectIntent([{ role: 'user', content: text }]);
    const newlyDetected: SavedPreferences = {};
    if (ctx.budgetTier) newlyDetected.budgetTier = ctx.budgetTier;
    if (ctx.travelerType) newlyDetected.travelerType = ctx.travelerType;
    if (ctx.destination) newlyDetected.destination = ctx.destination;
    if (ctx.duration) newlyDetected.duration = ctx.duration;

    if (Object.keys(newlyDetected).length > 0) {
      savePreferences(newlyDetected);
      setSavedPrefs(loadPreferences());
    }
  }, []);

  const handleSubmit = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Save preferences from this message
    extractAndSavePrefs(text);

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const assistantMsg: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    let convId = activeConversationId;
    let title = text.length > 60 ? text.slice(0, 60) + '…' : text;

    if (!convId) {
      convId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        title,
        messages: [userMsg, assistantMsg],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(convId);
      if (!text.startsWith('Surprise me')) {
        toast('Let\'s plan something unforgettable.', 'info');
      }
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, userMsg, assistantMsg],
                updatedAt: Date.now(),
                title: c.messages.length === 0 ? title : c.title,
              }
            : c
        )
      );
    }

    setIsStreaming(true);

    const existingMessages = activeConv?.messages || [];
    const apiMessages = [...existingMessages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Helper to get latest JSON itinerary from previous messages
    const getLatestItinerary = (msgs: ChatMessage[]) => {
      for (let i = msgs.length - 1; i >= 0; i--) {
        const m = msgs[i];
        if (m.role === 'assistant') {
          const trimmed = m.content.trim();
          const clean = trimmed.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          if (clean.startsWith('{')) {
            try {
              return JSON.parse(clean);
            } catch {}
          }
          const startIdx = trimmed.indexOf('{');
          const endIdx = trimmed.lastIndexOf('}');
          if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            const jsonCandidate = trimmed.substring(startIdx, endIdx + 1);
            try {
              return JSON.parse(jsonCandidate);
            } catch {}
          }
        }
      }
      return null;
    };
    
    const currentTrip = getLatestItinerary(existingMessages);

    // Helper to update assistant content
    const updateContent = (content: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content } : m
                ),
              }
            : c
        )
      );
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: convId, messages: apiMessages, preferences: savedPrefs, currentTrip }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullContent = '';

      // Debounce: accumulate chunks, flush every ~150ms during streaming
      let flushTimer: ReturnType<typeof setTimeout> | null = null;
      const flush = () => {
        flushTimer = null;
        updateContent(fullContent);
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });

        if (!flushTimer) {
          flushTimer = setTimeout(flush, 150);
        }
      }

      // Flush remaining content
      if (flushTimer) clearTimeout(flushTimer);

      // Perform local patch merging if it's a follow-up patch JSON
      try {
        const trimmed = fullContent.trim();
        const clean = trimmed.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        if (clean.startsWith('{')) {
          const parsed = JSON.parse(clean);
          const isFullTrip = parsed.hero && parsed.days && parsed.overview;
          if (!isFullTrip && currentTrip) {
            const merged = mergeItineraryPatch(currentTrip, parsed);
            fullContent = JSON.stringify(merged, null, 2);
          }
        }
      } catch (e) {
        console.error('Failed to parse or merge itinerary patch:', e);
      }

      updateContent(fullContent);

      // Generate smart title from first AI response
      if (convId && existingMessages.length === 0) {
        const newTitle = generateTitle(fullContent, text);
        if (newTitle) {
          setConversations((prev) =>
            prev.map((c) => c.id === convId ? { ...c, title: newTitle } : c)
          );
        }
        toast('Your journey is ready.', 'success');
      }
    } catch (err) {
      console.error('Chat API error:', err);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." }
                    : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, activeConversationId, activeConv, setConversations, setActiveConversationId, savedPrefs, extractAndSavePrefs]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, [setActiveConversationId]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, [setActiveConversationId]);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        setActiveConversationId(updated[0]?.id || null);
      }
      return updated;
    });
  }, [activeConversationId, setConversations, setActiveConversationId]);

  const handleClearPrefs = useCallback(() => {
    clearPreferences();
    setSavedPrefs({});
  }, []);

  const contextValue = useMemo(
    () => ({ tours: passThroughProps.tours, onShowTourDetail: passThroughProps.onShowTourDetail }),
    [passThroughProps.tours, passThroughProps.onShowTourDetail]
  );

  const content = showEmpty ? (
    <EmptyState
      onSubmit={handleSubmit}
      disabled={isStreaming}
      savedPrefs={hasPrefs ? savedPrefs : undefined}
      onClearPrefs={hasPrefs ? handleClearPrefs : undefined}
    />
  ) : (
    <ConversationView
      messages={messages}
      isStreaming={isStreaming}
      onSubmit={handleSubmit}
      disabled={isStreaming}
    />
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="flex-grow flex flex-col h-full max-h-full overflow-hidden relative paper-grain">
        {/* Top Header */}
        <header className="sticky top-0 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/30 bg-surface/90 backdrop-blur-md z-20 shrink-0 select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button (Mobile-only) */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary-surface text-night border border-border/30 shadow-sm cursor-pointer min-w-[40px] min-h-[40px]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-night" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Compass className="w-5 h-5 text-gold animate-spin-slow" />
              <span className="font-logo text-base sm:text-lg text-night font-bold tracking-tight lowercase">
                travebie<span className="text-gold">.ai</span>
              </span>
            </div>
            
            {/* Divider */}
            <span className="hidden sm:inline-block w-px h-4 bg-border/60 mx-1 shrink-0" />

            {/* Current Trip Title */}
            <span className="font-display font-medium text-caption text-night truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] capitalize shrink-0">
              {activeConv?.title || 'New Journey'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Share and PDF: Desktop only */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast('Share link copied to clipboard!', 'success');
              }}
              className="hidden lg:flex px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-border/40 hover:bg-secondary-surface text-micro font-bold text-muted hover:text-night transition-all duration-200 items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-gold" />
              <span>Share</span>
            </button>

            <button
              onClick={() => {
                toast('Preparing print layout...', 'info');
                window.print();
              }}
              className="hidden lg:flex px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-border/40 hover:bg-secondary-surface text-micro font-bold text-muted hover:text-night transition-all duration-200 items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-coral" />
              <span>PDF</span>
            </button>

            {/* Passport (Saved) Button: Mobile & Tablet only */}
            <button
              onClick={onShowPassport}
              className="lg:hidden px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-border/40 hover:bg-secondary-surface text-micro font-bold text-muted hover:text-night transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              aria-label="Passport"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal" />
              <span>Passport</span>
            </button>

            {/* Sign In / Out Button: Mobile & Tablet only */}
            {session ? (
              <button
                onClick={onSignOut}
                className="lg:hidden px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-border/40 hover:bg-secondary-surface text-micro font-bold text-muted hover:text-night transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-coral" />
                <span>Out</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="lg:hidden px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-border/40 hover:bg-secondary-surface text-micro font-bold text-muted hover:text-night transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-gold" />
                <span>In</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
          {content}
        </div>
      </div>
    </ChatContext.Provider>
  );
}
