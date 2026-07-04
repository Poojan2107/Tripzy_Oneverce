"use client";
import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptBoxProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MAX_CHARS = 2000;

const PLACEHOLDER_EXAMPLES = [
  "Plan a 5-day trip to Kerala...",
  "Plan a weekend under ₹15,000...",
  "Plan a luxury honeymoon in Kashmir...",
  "Find hidden gems near Jaipur...",
  "Plan a family vacation in December...",
  "Plan a solo trip through Himachal...",
];

export default function PromptBox({ onSubmit, disabled }: PromptBoxProps) {
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

  return (
    <div className="relative flex items-end gap-2 bg-surface border border-border/40 rounded-[20px] shadow-md transition-all duration-300 focus-within:border-gold/50 focus-within:shadow-[0_0_32px_rgba(244,182,61,0.15)] focus-within:-translate-y-0.5">
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
          className="w-full bg-transparent text-night text-body py-[14px] px-6 outline-none resize-none min-h-[60px] max-h-[200px] leading-relaxed placeholder:text-muted/40 placeholder:text-base disabled:opacity-50 pr-16"
          aria-label="Message input"
        />
        <AnimatePresence mode="wait">
          {text.length > 100 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute right-[72px] bottom-3 text-[10px] font-mono tabular-nums ${
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
        className="flex-none self-end mb-[10px] mr-3 w-11 h-11 flex items-center justify-center rounded-full bg-gold text-white shadow-sm transition-all duration-200 hover:bg-gold/90 hover:shadow-md hover:scale-105 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer min-w-[44px] min-h-[44px]"
        aria-label="Send message"
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-200" />
      </button>
    </div>
  );
}
