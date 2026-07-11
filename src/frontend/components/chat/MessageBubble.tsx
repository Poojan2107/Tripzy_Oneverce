import { memo } from 'react';
import { Compass } from 'lucide-react';
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
  const timeString = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (message.role === 'user') {
    return (
      <div className="chat-message-bubble flex flex-col items-end px-2 sm:px-6 py-2.5">
        <div className="max-w-[85%] md:max-w-[70%] bg-gradient-to-br from-[#F4B63D] to-[#E95C74] text-white rounded-[20px] rounded-tr-[4px] px-4 py-3 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-left font-sans">{message.content}</p>
        </div>
        {timeString && (
          <span className="text-[10px] text-muted/40 font-mono mt-1.5 mr-1 tabular-nums">{timeString}</span>
        )}
      </div>
    );
  }

  return (
    <div className="chat-message-bubble px-2 sm:px-6 py-3 border-b border-border/10 last:border-b-0">
      <div className="max-w-full group/card space-y-3">
        {/* Assistant Header */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center border border-teal/20 shrink-0">
              <Compass className="w-4 h-4 text-teal animate-spin-slow" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-night tracking-wide">Travebie AI</span>
              {timeString && <span className="text-[9px] text-muted/45 font-mono leading-none mt-0.5 tabular-nums">{timeString}</span>}
            </div>
          </div>
          {!isStreaming && message.content && (
            <CopyButton text={message.content} label="Copy response" />
          )}
        </div>

        {/* Content Render Area */}
        <div className="pl-0 sm:pl-10.5">
          <MessageRenderer content={message.content} isStreaming={isStreaming && message.role === 'assistant'} />
        </div>

        {/* Suggested Followups */}
        {!isStreaming && onSubmit && message.content && (
          <div className="pl-0 sm:pl-10.5 pt-1">
            <FollowUpSuggestions content={message.content} onSubmit={onSubmit} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
