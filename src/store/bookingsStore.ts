import { create } from 'zustand';
import { Booking, BookingStatus } from '../models';
import { bookingRepository } from '../storage/bookingRepository';

interface BookingsState {
  bookings: Booking[];
  hydrate: () => void;
  addBooking: (booking: Booking) => void;
  updateStatus: (bookingId: string, status: BookingStatus) => void;
  byUser: (userId: string) => Booking[];
  byVendor: (vendorId: string) => Booking[];
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  hydrate: () => set({ bookings: bookingRepository.getAll() }),
  addBooking: booking => {
    const next = bookingRepository.add(booking);
    set({ bookings: next });
  },
  updateStatus: (bookingId, status) => {
    const bookings = get().bookings.map(b =>
      b.bookingId === bookingId ? { ...b, status } : b,
    );
    bookingRepository.saveAll(bookings);
    set({ bookings });
  },
  byUser: userId =>
    get()
      .bookings.filter(b => b.userId === userId)
      .sort((a, b) => b.bookingId.localeCompare(a.bookingId)),
  byVendor: vendorId =>
    get()
      .bookings.filter(b => b.vendorId === vendorId)
      .sort((a, b) => b.bookingId.localeCompare(a.bookingId)),
}));
