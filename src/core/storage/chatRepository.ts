import { IMessage } from 'react-native-gifted-chat';
import { getJson, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

type StoredChatRow = Omit<IMessage, 'createdAt'> & { createdAt: string };

function key(userId: string): string {
  return `${STORAGE_KEYS.CHAT_PREFIX}${userId}`;
}

export const chatRepository = {
  getMessages(userId: string): IMessage[] {
    const rows = getJson<StoredChatRow[]>(key(userId));
    if (!rows?.length) {
      return [];
    }
    return rows.map(m => ({
      ...m,
      createdAt: new Date(m.createdAt),
    }));
  },
  saveMessages(userId: string, messages: IMessage[]): void {
    const rows: StoredChatRow[] = messages.map(m => ({
      ...m,
      createdAt:
        m.createdAt instanceof Date
          ? m.createdAt.toISOString()
          : String(m.createdAt),
    }));
    setJson(key(userId), rows);
  },
};
