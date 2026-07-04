"use client";
import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ChatMessage } from '../../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import PromptBox from './PromptBox';

interface ConversationProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

function groupMessages(messages: ChatMessage[]): ChatMessage[][] {
  const groups: ChatMessage[][] = [];
  for (const msg of messages) {
    if (groups.length === 0 || groups[groups.length - 1][0].role === msg.role) {
      groups.push([msg]);
    } else {
      groups[groups.length - 1].push(msg);
    }
  }
  return groups;
}

const Conversation = memo(function Conversation({ messages, isStreaming, onSubmit, disabled }: ConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const isNearBottomRef = useRef(true);

  const checkNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 120;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    isNearBottomRef.current = near;
    setShowScrollBtn(!near);
  }, []);

  // Dismiss mobile keyboard when user starts scrolling the message area
  const handleScrollStart = useCallback(() => {
    if (document.activeElement?.tagName === 'TEXTAREA') {
      (document.activeElement as HTMLTextAreaElement).blur();
    }
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBtn(false);
    isNearBottomRef.current = true;
  };

  const prefersReduced = useReducedMotion();
  const groups = groupMessages(messages);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div
        ref={scrollRef}
        onScroll={checkNearBottom}
        onTouchStart={handleScrollStart}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain pt-[calc(8px+env(safe-area-inset-top,0px)+44px)] pb-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence mode="popLayout">
          {groups.map((group, gi) => {
            const isUser = group[0].role === 'user';
            return (
              <motion.div
                key={group[0].id}
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
                className={isUser ? 'mb-2 last:mb-0' : 'mb-3 last:mb-0'}
              >
                {group.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} isStreaming={isStreaming} onSubmit={onSubmit} />
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <TypingIndicator />
          </motion.div>
        )}

        {isStreaming && showScrollBtn && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center py-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-micro font-mono font-bold uppercase tracking-wider text-gold/70">
              <Sparkles className="w-3 h-3" />
              AI is generating...
            </span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border border-border/40 shadow-md flex items-center justify-center cursor-pointer z-10 hover:bg-surface transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5 text-muted" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-t from-background via-background/90 to-transparent pt-5 pb-[max(8px,env(safe-area-inset-bottom))] px-4 lg:px-6">
        <PromptBox onSubmit={onSubmit} disabled={disabled} />
      </div>
    </div>
  );
});

export default Conversation;
