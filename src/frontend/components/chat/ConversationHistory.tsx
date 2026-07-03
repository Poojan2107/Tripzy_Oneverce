"use client";
import { Trash2, MessageSquare } from 'lucide-react';
import type { Conversation } from '../../types';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ConversationHistory({
  conversations, activeId, onSelect, onDelete,
}: ConversationHistoryProps) {
  if (conversations.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-micro text-muted/40 font-mono uppercase tracking-widest">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 px-2">
      {conversations.slice(0, 30).map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(conv.id); }}
          className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
            conv.id === activeId
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <div className="flex-1 min-w-0">
            <p className="text-caption truncate">{conv.title || 'New Chat'}</p>
            <p className="text-micro text-white/30 font-mono">{timeAgo(conv.updatedAt)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/30 hover:text-coral cursor-pointer"
            aria-label="Delete conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
