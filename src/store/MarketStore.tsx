import { create } from 'zustand';

type MarketStore = {
  searchText: string;
  setSearchText: (text: string) => void;
  clearSearch: () => void;
};

export const useMarketStore = create<MarketStore>((set) => ({
  searchText: '',
  setSearchText: (text) => set({ searchText: text }),
  clearSearch: () => set({ searchText: '' }),
}));
