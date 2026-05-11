import { getDistance } from 'geolib';
import { MatchedVendor, StoredLocation, Vendor } from '../../core/models';

export function matchVendorsByDistance(
  vendors: Vendor[],
  userLocation: StoredLocation | null,
  filter?: (v: Vendor) => boolean,
): MatchedVendor[] {
  if (!userLocation) {
    return [];
  }
  const base = filter ? vendors.filter(filter) : vendors;
  const withDistance: MatchedVendor[] = base.map(v => ({
    ...v,
    distanceMeters: getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: v.latitude, longitude: v.longitude },
    ),
  }));
  return withDistance.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
