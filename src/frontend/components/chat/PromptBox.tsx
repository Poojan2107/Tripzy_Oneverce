"use client";
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Mic, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptBoxProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  variant?: 'chat' | 'hero';
}

const MAX_CHARS = 2000;

const PLACEHOLDER_EXAMPLES = [
  "generate your trip",
];

export default function PromptBox({ onSubmit, disabled, variant = 'chat' }: PromptBoxProps) {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charsLeft = MAX_CHARS - text.length;
  const isNearLimit = text.length > MAX_CHARS * 0.85;
  const isOverLimit = text.length > MAX_CHARS;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed && !disabled && !isOverLimit) {
      onSubmit(trimmed);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [text]);

  // Rotate placeholder examples while input is empty
  useEffect(() => {
    if (text.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [text]);

  const hasText = text.trim().length > 0;
  const placeholder = PLACEHOLDER_EXAMPLES[placeholderIndex];

  // ── HERO VARIANT ─────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <div className="w-full relative flex items-center gap-2 bg-white/[0.92] backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] transition-all duration-300 focus-within:shadow-[0_8px_48px_rgba(244,182,61,0.35)] focus-within:border-gold/60 focus-within:bg-white/98 px-2 py-1">
        <div className="flex-none ml-2 text-night/30">
          <Search className="w-5 h-5" />
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            maxLength={MAX_CHARS + 100}
            className="w-full bg-transparent text-night font-medium text-[15px] py-3.5 px-2 outline-none resize-none min-h-[56px] max-h-[160px] leading-snug placeholder:text-night/35 placeholder:font-normal disabled:opacity-50"
            aria-label="Where would you like to go?"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!hasText || disabled || isOverLimit}
          className="flex-none mr-1 w-12 h-12 flex items-center justify-center rounded-xl bg-gold text-white shadow-md transition-all duration-200 hover:bg-gold/90 hover:shadow-lg hover:scale-105 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          aria-label="Send message"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ── CHAT VARIANT (default) ────────────────────────────────────────────────
  return (
    <div className="w-full relative flex items-end gap-1.5 bg-surface border border-border/40 rounded-[24px] shadow-soft focus-within:border-gold/45 focus-within:shadow-[0_8px_32px_rgba(244,182,61,0.08)] transition-all duration-300 py-1.5 px-2">
      {/* Attachment Button */}
      <button
        onClick={() => {
          alert("Attachments are coming soon!");
        }}
        disabled={disabled}
        className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-muted hover:text-night hover:bg-secondary-surface transition-all duration-200 cursor-pointer min-w-[40px] min-h-[40px]"
        aria-label="Add attachment"
      >
        <Paperclip className="w-4.5 h-4.5" />
      </button>

      {/* Voice Button */}
      <button
        onClick={() => {
          alert("Voice input is coming soon!");
        }}
        disabled={disabled}
        className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-muted hover:text-night hover:bg-secondary-surface transition-all duration-200 cursor-pointer min-w-[40px] min-h-[40px]"
        aria-label="Voice input"
      >
        <Mic className="w-4.5 h-4.5" />
      </button>

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          maxLength={MAX_CHARS + 100}
          className="w-full bg-transparent text-night text-[15px] py-[10px] px-2 outline-none resize-none min-h-[40px] max-h-[180px] leading-relaxed placeholder:text-muted/40 placeholder:text-[15px] disabled:opacity-50 pr-12 focus:outline-none"
          aria-label="Message input"
        />
        <AnimatePresence mode="wait">
          {text.length > 100 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute right-3 bottom-2 text-[10px] font-mono tabular-nums ${
                isOverLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-muted/30'
              }`}
            >
              {charsLeft}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!hasText || disabled || isOverLimit}
        className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-gold text-white shadow-sm transition-all duration-200 hover:bg-gold/90 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer min-w-[40px] min-h-[40px]"
        aria-label="Send message"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
