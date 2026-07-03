"use client";
import { createContext, useContext } from 'react';
import type { Tour } from '../../types';

interface ChatContextValue {
  tours: Tour[];
  onShowTourDetail: (tour: Tour) => void;
}

const ChatContext = createContext<ChatContextValue>({
  tours: [],
  onShowTourDetail: () => {},
});

export const useChat = () => useContext(ChatContext);
export default ChatContext;
