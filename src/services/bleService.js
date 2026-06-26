import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

class BleService {
  constructor() {
    this.manager = new BleManager();
    this.seenDeviceIds = new Set();
  }

  async requestPermissions() {
    if (Platform.OS !== 'android') {
      return true;
    }

    if (Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    }

    const locationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return locationGranted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async isBluetoothReady() {
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }

  onBluetoothStateChange(callback) {
    return this.manager.onStateChange(callback, true);
  }

  startScan(onDeviceFound, onError) {
    this.seenDeviceIds.clear();

    this.manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        onError?.(error);
        return;
      }

      if (!device?.id || this.seenDeviceIds.has(device.id)) {
        return;
      }

      this.seenDeviceIds.add(device.id);
      onDeviceFound?.({
        id: device.id,
        name: device.name || device.localName || `Device ${device.id.slice(0, 8)}`,
        rssi: device.rssi,
      });
    });
  }

  stopScan() {
    return this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId) {
    await this.stopScan();
    const device = await this.manager.connectToDevice(deviceId, { autoConnect: false });
    await device.discoverAllServicesAndCharacteristics();
    return device;
  }

  async disconnectDevice(deviceId) {
    await this.manager.cancelDeviceConnection(deviceId);
  }

  onDeviceDisconnected(deviceId, callback) {
    return this.manager.onDeviceDisconnected(deviceId, callback);
  }

  async getWritableCharacteristic(deviceId) {
    try {
      const services = await this.manager.servicesForDevice(deviceId);
      for (const service of services) {
        const characteristics = await this.manager.characteristicsForDevice(deviceId, service.uuid);
        for (const characteristic of characteristics) {
          if (characteristic.isWritableWithResponse || characteristic.isWritableWithoutResponse) {
            return {
              serviceUUID: service.uuid,
              characteristicUUID: characteristic.uuid,
              isWritableWithoutResponse: characteristic.isWritableWithoutResponse
            };
          }
        }
      }
    } catch (err) {
      console.warn('Error discovering services/characteristics:', err);
    }
    return null;
  }

  async sendSampleCommand(deviceId, sampleIndex) {
    if (!deviceId) {
      throw new Error('Device not connected');
    }
    try {
      const charInfo = await this.getWritableCharacteristic(deviceId);
      if (!charInfo) {
        console.warn('No writable characteristic found on device, continuing test locally.');
        return false;
      }
      
      const payload = `TAKE_SAMPLE_${sampleIndex}`;
      const base64Payload = base64Encode(payload);
      
      if (charInfo.isWritableWithoutResponse) {
        await this.manager.writeCharacteristicWithoutResponseForDevice(
          deviceId,
          charInfo.serviceUUID,
          charInfo.characteristicUUID,
          base64Payload
        );
      } else {
        await this.manager.writeCharacteristicWithResponseForDevice(
          deviceId,
          charInfo.serviceUUID,
          charInfo.characteristicUUID,
          base64Payload
        );
      }
      console.log(`Successfully sent BLE command: ${payload}`);
      return true;
    } catch (error) {
      console.error('Failed to send BLE command:', error);
      throw error;
    }
  }
}

const base64Encode = (str) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  for (let i = 0; i < str.length; i += 3) {
    const c1 = str.charCodeAt(i);
    const c2 = i + 1 < str.length ? str.charCodeAt(i + 1) : NaN;
    const c3 = i + 2 < str.length ? str.charCodeAt(i + 2) : NaN;
    const byte1 = c1 >> 2;
    const byte2 = ((c1 & 3) << 4) | (Number.isNaN(c2) ? 0 : c2 >> 4);
    const byte3 = Number.isNaN(c2) ? 64 : (((c2 & 15) << 2) | (Number.isNaN(c3) ? 0 : c3 >> 6));
    const byte4 = Number.isNaN(c3) ? 64 : c3 & 63;
    output += chars.charAt(byte1) + chars.charAt(byte2) + chars.charAt(byte3) + chars.charAt(byte4);
  }
  return output;
};

export const bleService = new BleService();
