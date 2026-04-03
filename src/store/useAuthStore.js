import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      userToken: null,

      login: (token) => set({ isAuthenticated: true, userToken: token }),
      logout: () => set({ isAuthenticated: false, userToken: null }),
    }),
    {
      name: 'bhoomitra-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
