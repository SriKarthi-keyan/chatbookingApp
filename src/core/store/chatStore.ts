import { create } from 'zustand';
import { IMessage } from 'react-native-gifted-chat';
import { chatRepository } from '../storage/chatRepository';

interface ChatState {
  messagesByUserId: Record<string, IMessage[]>;
  hydrateForUser: (userId: string) => void;
  setMessages: (userId: string, messages: IMessage[]) => void;
}

export const useChatStore = create<ChatState>(set => ({
  messagesByUserId: {},
  hydrateForUser: userId => {
    const loaded = chatRepository.getMessages(userId);
    set(state => ({
      messagesByUserId: { ...state.messagesByUserId, [userId]: loaded },
    }));
  },
  setMessages: (userId, messages) => {
    chatRepository.saveMessages(userId, messages);
    set(state => ({
      messagesByUserId: { ...state.messagesByUserId, [userId]: messages },
    }));
  },
}));
