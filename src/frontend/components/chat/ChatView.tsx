"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Conversation, ChatMessage, Tour } from '../../types';
import ChatContext from './ChatContext';
import EmptyState from './EmptyState';
import ConversationView from './Conversation';

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
  /** When set, auto-submits this text as a new conversation prompt */
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
    // localStorage full — trim harder
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, 20)));
    } catch {}
  }
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

  // Auto-submit pending prompt (from "Plan this trip" in TourDetailsModal)
  const pendingPromptRef = useRef(passThroughProps.pendingPrompt);
  useEffect(() => {
    const pp = passThroughProps.pendingPrompt;
    if (pp && pp !== pendingPromptRef.current) {
      pendingPromptRef.current = pp;
      handleSubmit(pp);
    }
  }, [passThroughProps.pendingPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load from localStorage on mount
  useEffect(() => {
    if (!isControlled) {
      const saved = loadConversations();
      setLocalConversations(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage
  useEffect(() => {
    if (!isControlled && conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations, isControlled]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConv?.messages || [];
  const showEmpty = messages.length === 0 && !isStreaming;

  const handleSubmit = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

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

    // Build API messages — include current messages plus the new user message
    const existingMessages = activeConv?.messages || [];
    const apiMessages = [...existingMessages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: fullContent } : m
                  ),
                }
              : c
          )
        );
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
  }, [isStreaming, activeConversationId, activeConv, setConversations, setActiveConversationId]);

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

  const contextValue = { tours: passThroughProps.tours, onShowTourDetail: passThroughProps.onShowTourDetail };

  if (showEmpty) {
    return (
      <ChatContext.Provider value={contextValue}>
        <EmptyState onSubmit={handleSubmit} disabled={isStreaming} />
      </ChatContext.Provider>
    );
  }

  return (
    <ChatContext.Provider value={contextValue}>
      <ConversationView
        messages={messages}
        isStreaming={isStreaming}
        onSubmit={handleSubmit}
        disabled={isStreaming}
      />
    </ChatContext.Provider>
  );
}
