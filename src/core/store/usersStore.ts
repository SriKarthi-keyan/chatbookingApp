import { create } from 'zustand';
import { User } from '../models';
import { userRepository } from '../storage/userRepository';

interface UsersState {
  users: User[];
  hydrate: () => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  findByMobile: (mobile: string) => User | undefined;
  findById: (id: string) => User | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  hydrate: () => set({ users: userRepository.getAll() }),
  setUsers: users => {
    userRepository.saveAll(users);
    set({ users });
  },
  addUser: user => {
    const next = userRepository.add(user);
    set({ users: next });
  },
  findByMobile: mobile => get().users.find(u => u.mobile === mobile),
  findById: id => get().users.find(u => u.id === id),
}));
