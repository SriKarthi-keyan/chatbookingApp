import { useAuthStore } from './authStore';
import { useBookingsStore } from './bookingsStore';
import { useUsersStore } from './usersStore';
import { useVendorsStore } from './vendorsStore';

export function bootstrapStores(): void {
  useAuthStore.getState().hydrate();
  useUsersStore.getState().hydrate();
  useVendorsStore.getState().hydrate();
  useBookingsStore.getState().hydrate();
}
