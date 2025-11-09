import { create } from 'zustand';

interface VehicleSearchStore {
  query: string;
  setQuery: (value: string) => void;
  clearQuery: () => void;
}

export const useVehicleSearchStore = create<VehicleSearchStore>(set => ({
  query: '',
  setQuery: value => set({ query: value }),
  clearQuery: () => set({ query: '' }),
}));
