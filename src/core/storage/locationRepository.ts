import { StoredLocation } from '../models';
import { getJson, removeKey, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

function keyForUser(userId: string): string {
  return `${STORAGE_KEYS.USER_LOCATION_PREFIX}${userId}`;
}

export const locationRepository = {
  getForUser(userId: string): StoredLocation | null {
    return getJson<StoredLocation>(keyForUser(userId));
  },
  setForUser(userId: string, location: Omit<StoredLocation, 'updatedAt'>): void {
    const payload: StoredLocation = {
      ...location,
      updatedAt: Date.now(),
    };
    setJson(keyForUser(userId), payload);
  },
  clearForUser(userId: string): void {
    removeKey(keyForUser(userId));
  },
};
