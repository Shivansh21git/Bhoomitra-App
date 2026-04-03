import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTestStore = create(
  persist(
    (set) => ({
      // Step 1: Device
      deviceConnected: false,
      deviceDetails: null,
      
      // Step 2: Farmer Details
      farmerDetails: {
        name: '',
        mobile: '',
        farmName: '',
        soilType: 'Loamy',
        farmSize: '',
        unit: 'Acres',
        state: '',
        district: '',
        taluka: '',
        pinCode: '',
      },

      // Step 3: Readings
      readings: [],
      
      // Step 5: AI Advisory results
      advisory: null,

      // Actions
      connectDevice: (device) => set({ deviceConnected: true, deviceDetails: device }),
      disconnectDevice: () => set({ deviceConnected: false, deviceDetails: null }),
      
      updateFarmerDetails: (details) => set((state) => ({
        farmerDetails: { ...state.farmerDetails, ...details }
      })),

      addReading: (reading) => set((state) => ({
        readings: [...state.readings, reading]
      })),
      
      clearReadings: () => set({ readings: [] }),
      
      setAdvisory: (advisoryData) => set({ advisory: advisoryData }),

      resetTestSession: () => set({
        deviceConnected: false,
        deviceDetails: null,
        farmerDetails: {
          name: '', mobile: '', farmName: '', soilType: 'Loamy', farmSize: '',
          unit: 'Acres', state: '', district: '', taluka: '', pinCode: '',
        },
        readings: [],
        advisory: null,
      }),
    }),
    {
      name: 'bhoomitra-test-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

