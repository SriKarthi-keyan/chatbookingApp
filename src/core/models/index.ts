export type BookingStatus = 'pending' | 'accepted' | 'completed';

export type AppRole = 'user' | 'vendor';

export interface User {
  id: string;
  name: string;
  mobile: string;
  password: string;
}

export interface Vendor {
  id: string;
  name: string;
  mobile: string;
  password: string;
  address: string;
  profileImage: string;
  latitude: number;
  longitude: number;
  serviceType: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  vendorId: string;
  service: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
}

export interface Session {
  role: AppRole;
  userId?: string;
  vendorId?: string;
}

export interface StoredLocation {
  latitude: number;
  longitude: number;
  updatedAt: number;
}

export interface MatchedVendor extends Vendor {
  distanceMeters: number;
}
