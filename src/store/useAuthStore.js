import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      userToken: null,
      refreshToken: null,
      userInfo: null,

      login: (token, refresh, info) => set({ 
        isAuthenticated: true, 
        userToken: token,
        refreshToken: refresh,
        userInfo: info
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        userToken: null,
        refreshToken: null,
        userInfo: null
      }),
    }),
    {
      name: 'bhoomitra-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
