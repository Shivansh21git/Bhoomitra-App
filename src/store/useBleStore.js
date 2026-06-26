import { create } from 'zustand';

export const useBleStore = create(set => ({
  isConnected: false,
  connectedDeviceId: null,
  connectedDeviceName: null,
  isScanning: false,
  isConnecting: false,
  scannedDevices: [],
  bleError: null,

  setScanning: isScanning => set({ isScanning }),
  setConnecting: isConnecting => set({ isConnecting }),
  setScannedDevices: scannedDevices => set({ scannedDevices }),
  addScannedDevice: device =>
    set(state => {
      if (state.scannedDevices.some(item => item.id === device.id)) {
        return state;
      }
      return { scannedDevices: [...state.scannedDevices, device] };
    }),
  setBleError: bleError => set({ bleError }),
  setConnected: device =>
    set({
      isConnected: true,
      connectedDeviceId: device.id,
      connectedDeviceName: device.name,
      isConnecting: false,
      bleError: null,
    }),
  setDisconnected: () =>
    set({
      isConnected: false,
      connectedDeviceId: null,
      connectedDeviceName: null,
      isConnecting: false,
    }),
  resetScan: () =>
    set({
      scannedDevices: [],
      bleError: null,
      isScanning: false,
      isConnecting: false,
    }),
}));
