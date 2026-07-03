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

export default function PromptBox({ onSubmit, disabled, placeholder = "Describe your dream journey..." }: PromptBoxProps) {
  const [text, setText] = useState('');
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
      ta.style.height = Math.min(ta.scrollHeight, 240) + 'px';
    }
  }, [text]);

  const hasText = text.trim().length > 0;

  return (
    <div className="relative flex items-end gap-2 bg-surface border border-border/50 rounded-2xl shadow-sm transition-all duration-200 focus-within:border-gold/40 focus-within:shadow-[0_0_24px_rgba(244,182,61,0.12)]">
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
          className="w-full bg-transparent text-night text-body py-3.5 px-5 outline-none resize-none min-h-[52px] max-h-[240px] leading-relaxed placeholder:text-muted/40 disabled:opacity-50 pr-14"
          aria-label="Message input"
        />
        <AnimatePresence>
          {text.length > 100 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute right-4 bottom-3 text-[10px] font-mono tabular-nums ${
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
        className="flex-none self-end mb-2 mr-2.5 w-11 h-11 flex items-center justify-center rounded-full bg-gold text-white shadow-sm transition-all duration-200 hover:bg-gold/90 hover:shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer min-w-[44px] min-h-[44px]"
        aria-label="Send message"
      >
        <ArrowUp className={`w-5 h-5 transition-transform duration-200 ${hasText ? 'rotate-0' : 'rotate-0'}`} />
      </button>
    </div>
  );
}
