"use client";
import { memo } from 'react';
import type { ChatMessage } from '../../types';
import MessageRenderer from './MessageRenderer';
import FollowUpSuggestions from './FollowUpSuggestions';
import CopyButton from './CopyButton';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onSubmit?: (text: string) => void;
}

const MessageBubble = memo(function MessageBubble({ message, isStreaming, onSubmit }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end px-6 py-1.5">
        <div className="max-w-[85%] md:max-w-[70%] bg-gold/10 border border-gold/15 rounded-2xl px-4 py-3 text-right">
          <p className="text-body text-night leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-1.5">
      <div className="max-w-full group/card">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <span className="text-micro font-bold uppercase tracking-widest text-muted/50">Travebie AI</span>
          </div>
          {!isStreaming && message.content && (
            <CopyButton text={message.content} label="Copy response" />
          )}
        </div>
        <MessageRenderer content={message.content} />
        {!isStreaming && onSubmit && message.content && (
          <FollowUpSuggestions content={message.content} onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
