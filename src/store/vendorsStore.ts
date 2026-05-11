import { create } from 'zustand';
import { Vendor } from '../models';
import { vendorRepository } from '../storage/vendorRepository';

interface VendorsState {
  vendors: Vendor[];
  hydrate: () => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
  findByMobile: (mobile: string) => Vendor | undefined;
  findById: (id: string) => Vendor | undefined;
}

export const useVendorsStore = create<VendorsState>((set, get) => ({
  vendors: [],
  hydrate: () => set({ vendors: vendorRepository.getAll() }),
  addVendor: vendor => {
    const next = vendorRepository.add(vendor);
    set({ vendors: next });
  },
  updateVendor: vendor => {
    const next = vendorRepository.update(vendor);
    set({ vendors: next });
  },
  findByMobile: mobile => get().vendors.find(v => v.mobile === mobile),
  findById: id => get().vendors.find(v => v.id === id),
}));
