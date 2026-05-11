import AsyncStorage from '@react-native-async-storage/async-storage';

/** In-memory mirror of persisted keys; load once via `hydrateJsonStorage()` before reads. */
const cache = new Map<string, string | null>();
let hydrated = false;

/**
 * Load all keys from AsyncStorage into memory. Call once at app startup before `bootstrapStores()`.
 */
export async function hydrateJsonStorage(): Promise<void> {
  if (hydrated) {
    return;
  }
  const keys = await AsyncStorage.getAllKeys();
  if (keys.length > 0) {
    const record = await AsyncStorage.getMany(keys);
    for (const k of keys) {
      cache.set(k, record[k] ?? null);
    }
  }
  hydrated = true;
}

export function setJson(key: string, value: unknown): void {
  const serialized = JSON.stringify(value);
  cache.set(key, serialized);
  void AsyncStorage.setItem(key, serialized);
}

export function getJson<T>(key: string): T | null {
  const raw = cache.get(key);
  if (raw === undefined || raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function removeKey(key: string): void {
  cache.delete(key);
  void AsyncStorage.removeItem(key);
}
