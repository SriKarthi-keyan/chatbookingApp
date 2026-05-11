import { Session } from '../models';
import { getJson, removeKey, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

export const sessionRepository = {
  get(): Session | null {
    return getJson<Session>(STORAGE_KEYS.SESSION);
  },
  set(session: Session): void {
    setJson(STORAGE_KEYS.SESSION, session);
  },
  clear(): void {
    removeKey(STORAGE_KEYS.SESSION);
  },
};
