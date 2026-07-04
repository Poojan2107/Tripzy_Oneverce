"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Conversation, ChatMessage, Tour } from '../../types';
import ChatContext from './ChatContext';
import EmptyState from './EmptyState';
import ConversationView from './Conversation';
import { detectIntent } from '../../lib/intentDetector';
import { savePreferences, loadPreferences, clearPreferences } from '../../lib/preferenceStore';
import type { SavedPreferences } from '../../lib/preferenceStore';
import { findLocation } from '../../lib/placeData';

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

function generateTitle(content: string): string | null {
  if (!content.trim()) return null;
  const lower = content.toLowerCase();

  const dest = findLocation(content);
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

  const durationMatch = content.match(/\b(\d+)[- ]day\b/i);
  const duration = durationMatch?.[1] || null;

  const parts: string[] = [];
  if (intent && intent !== 'Weekend') parts.push(intent);
  if (duration && duration !== 'Weekend') parts.push(`${duration}-Day`);
  if (destination) parts.push(destination);

  if (parts.length > 0) return parts.join(' ').slice(0, 50);

  const overviewMatch = lower.match(/journey overview/);
  if (overviewMatch) {
    const idx = lower.indexOf('journey overview');
    const after = content.slice(idx + 16).split('\n')[0]?.trim();
    if (after && after.length < 50) return after.slice(0, 50);
  }

  return null;
}

export default function ChatView(props: ChatViewProps) {
  const {
    externalConversations, externalActiveId,
    onConversationsChange, onActiveConversationChange,
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

  const pendingPromptRef = useRef(passThroughProps.pendingPrompt);
  useEffect(() => {
    const pp = passThroughProps.pendingPrompt;
    if (pp && pp !== pendingPromptRef.current) {
      pendingPromptRef.current = pp;
      handleSubmit(pp);
    }
  }, [passThroughProps.pendingPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

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
        body: JSON.stringify({ messages: apiMessages, preferences: savedPrefs }),
      });

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
      updateContent(fullContent);

      // Generate smart title from first AI response
      if (convId && existingMessages.length === 0) {
        const newTitle = generateTitle(fullContent);
        if (newTitle) {
          setConversations((prev) =>
            prev.map((c) => c.id === convId ? { ...c, title: newTitle } : c)
          );
        }
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
      <div className="min-h-0 flex-1 flex paper-grain">
        {content}
      </div>
    </ChatContext.Provider>
  );
}
