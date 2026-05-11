import { Booking } from '../models';
import { getJson, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

export const bookingRepository = {
  getAll(): Booking[] {
    return getJson<Booking[]>(STORAGE_KEYS.BOOKINGS) ?? [];
  },
  saveAll(bookings: Booking[]): void {
    setJson(STORAGE_KEYS.BOOKINGS, bookings);
  },
  add(booking: Booking): Booking[] {
    const bookings = this.getAll();
    const next = [...bookings, booking];
    this.saveAll(next);
    return next;
  },
  update(booking: Booking): Booking[] {
    const bookings = this.getAll();
    const next = bookings.map(b =>
      b.bookingId === booking.bookingId ? booking : b,
    );
    this.saveAll(next);
    return next;
  },
};
