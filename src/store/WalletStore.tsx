import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Wallet {
  network: string;
  address: string;
}

export interface WalletState {
  history: Wallet[];
  favorites: Wallet[];
  loadWallets: () => Promise<void>;
  addWallet: (wallet: Wallet) => Promise<void>;
  toggleFavorite: (wallet: Wallet) => Promise<void>;
  removeWallet: (wallet: Wallet) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  history: [],
  favorites: [],

  // Cargar datos desde AsyncStorage
  loadWallets: async () => {
    const history = JSON.parse((await AsyncStorage.getItem('walletHistory')) || '[]');
    const favorites = JSON.parse((await AsyncStorage.getItem('walletFavorites')) || '[]');
    set({ history, favorites });
  },


  addWallet: async (wallet) => {
    if (wallet.network === 'UNKNOWN') return;

    const exists = get().history.find(w => w.address === wallet.address);
    if (!exists) {
      const newHistory = [...get().history, wallet];
      set({ history: newHistory });
      await AsyncStorage.setItem('walletHistory', JSON.stringify(newHistory));
    }
  },


  toggleFavorite: async (wallet) => {
    const isFav = get().favorites.some(f => f.address === wallet.address);
    const newFavorites = isFav
      ? get().favorites.filter(f => f.address !== wallet.address)
      : [...get().favorites, wallet];
    set({ favorites: newFavorites });
    await AsyncStorage.setItem('walletFavorites', JSON.stringify(newFavorites));
  },

  removeWallet: async (wallet) => {
    const newHistory = get().history.filter(w => w.address !== wallet.address);
    const newFavorites = get().favorites.filter(f => f.address !== wallet.address);
    set({ history: newHistory, favorites: newFavorites });
    await AsyncStorage.setItem('walletHistory', JSON.stringify(newHistory));
    await AsyncStorage.setItem('walletFavorites', JSON.stringify(newFavorites));
  },

  clearHistory: async () => {
    set({ history: [], favorites: [] });
    await AsyncStorage.removeItem('walletHistory');
    await AsyncStorage.removeItem('walletFavorites');
  },
}));
