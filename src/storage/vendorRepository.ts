import { Vendor } from '../models';
import { getJson, setJson } from './nativeStorage';
import { STORAGE_KEYS } from './storageKeys';

export const vendorRepository = {
  getAll(): Vendor[] {
    return getJson<Vendor[]>(STORAGE_KEYS.VENDORS) ?? [];
  },
  saveAll(vendors: Vendor[]): void {
    setJson(STORAGE_KEYS.VENDORS, vendors);
  },
  add(vendor: Vendor): Vendor[] {
    const vendors = this.getAll();
    const next = [...vendors, vendor];
    this.saveAll(next);
    return next;
  },
  findByMobile(mobile: string): Vendor | undefined {
    return this.getAll().find(v => v.mobile === mobile);
  },
  findById(id: string): Vendor | undefined {
    return this.getAll().find(v => v.id === id);
  },
  update(vendor: Vendor): Vendor[] {
    const vendors = this.getAll();
    const next = vendors.map(v => (v.id === vendor.id ? vendor : v));
    this.saveAll(next);
    return next;
  },
};
