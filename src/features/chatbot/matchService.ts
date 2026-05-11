import { MatchedVendor, StoredLocation, Vendor } from '../../core/models';
import { matchVendorsByDistance } from '../../shared/utils/geo';

export interface ServiceRule {
  slug: string;
  label: string;
  keywords: string[];
}

export const SERVICE_RULES: ServiceRule[] = [
  {
    slug: 'electrician',
    label: 'Electrician',
    keywords: ['electrician', 'electric', 'wiring', 'wire', 'power outage'],
  },
  {
    slug: 'plumber',
    label: 'Plumber',
    keywords: ['plumber', 'plumbing', 'leak', 'pipe', 'drain', 'tap'],
  },
  {
    slug: 'ac',
    label: 'AC Repair',
    keywords: ['ac', 'air condition', 'cooling', 'hvac', 'split', 'compressor'],
  },
  {
    slug: 'painter',
    label: 'Painter',
    keywords: ['painter', 'paint', 'painting', 'wall color'],
  },
  {
    slug: 'carpenter',
    label: 'Carpenter',
    keywords: ['carpenter', 'woodwork', 'furniture', 'cabinet'],
  },
  {
    slug: 'cleaner',
    label: 'Cleaning',
    keywords: ['clean', 'cleaning', 'maid', 'deep clean'],
  },
];

export function detectServiceRule(message: string): ServiceRule | null {
  const lower = message.toLowerCase();
  for (const rule of SERVICE_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return rule;
    }
  }
  return null;
}

function vendorMatchesRule(vendor: Vendor, rule: ServiceRule): boolean {
  const hay = `${vendor.serviceType}`.toLowerCase();
  if (hay.includes(rule.slug)) {
    return true;
  }
  if (hay.includes(rule.label.toLowerCase())) {
    return true;
  }
  return rule.keywords.some(k => hay.includes(k));
}

export function findNearbyMatchingVendors(
  vendors: Vendor[],
  userLocation: StoredLocation | null,
  rule: ServiceRule,
): MatchedVendor[] {
  return matchVendorsByDistance(vendors, userLocation, v =>
    vendorMatchesRule(v, rule),
  );
}

export function findAllNearbyVendors(
  vendors: Vendor[],
  userLocation: StoredLocation | null,
  query?: string,
): MatchedVendor[] {
  const q = query?.trim().toLowerCase();
  return matchVendorsByDistance(
    vendors,
    userLocation,
    v =>
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.serviceType.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q),
  );
}
