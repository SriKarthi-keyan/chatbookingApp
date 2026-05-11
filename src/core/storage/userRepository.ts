import { User } from '../models';
import { getJson, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

export const userRepository = {
  getAll(): User[] {
    return getJson<User[]>(STORAGE_KEYS.USERS) ?? [];
  },
  saveAll(users: User[]): void {
    setJson(STORAGE_KEYS.USERS, users);
  },
  add(user: User): User[] {
    const users = this.getAll();
    const next = [...users, user];
    this.saveAll(next);
    return next;
  },
  findByMobile(mobile: string): User | undefined {
    return this.getAll().find(u => u.mobile === mobile);
  },
  findById(id: string): User | undefined {
    return this.getAll().find(u => u.id === id);
  },
};
