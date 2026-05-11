import { useCallback, useState } from 'react';
import { locationRepository } from '../../core/storage/locationRepository';
import { getCurrentPositionWithPermission } from '../../core/services/locationService';

export function useUserLocationSync(userId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentPositionWithPermission();
      locationRepository.setForUser(userId, coords);
      return coords;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Unable to read your location.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { refresh, loading, error };
}
