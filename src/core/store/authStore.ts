import { create } from 'zustand';
import { Session } from '../models';
import { sessionRepository } from '../storage/sessionRepository';

interface AuthState {
  session: Session | null;
  isHydrated: boolean;
  hydrate: () => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  session: null,
  isHydrated: false,
  hydrate: () => {
    const session = sessionRepository.get();
    set({ session, isHydrated: true });
  },
  setSession: session => {
    if (session) {
      sessionRepository.set(session);
    } else {
      sessionRepository.clear();
    }
    set({ session });
  },
  logout: () => {
    sessionRepository.clear();
    set({ session: null });
  },
}));
