import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bleService } from '../services/bleService';
import { useBleStore } from '../store/useBleStore';
import { theme } from '../theme/theme';

export default function BluetoothConnectModal({ visible, onClose }) {
  const isScanning = useBleStore(state => state.isScanning);
  const isConnecting = useBleStore(state => state.isConnecting);
  const scannedDevices = useBleStore(state => state.scannedDevices);
  const bleError = useBleStore(state => state.bleError);
  const isConnected = useBleStore(state => state.isConnected);
  const connectedDeviceName = useBleStore(state => state.connectedDeviceName);

  const startScan = useCallback(async () => {
    const store = useBleStore.getState();
    store.setBleError(null);
    store.setScannedDevices([]);

    const hasPermission = await bleService.requestPermissions();
    if (!hasPermission) {
      store.setBleError('Bluetooth permissions are required to scan for devices.');
      return;
    }

    const isReady = await bleService.isBluetoothReady();
    if (!isReady) {
      store.setBleError('Please turn on Bluetooth and try again.');
      return;
    }

    store.setScanning(true);

    try {
      bleService.startScan(
        device => useBleStore.getState().addScannedDevice(device),
        error => {
          useBleStore.getState().setBleError(error.message || 'Failed to scan for devices.');
          useBleStore.getState().setScanning(false);
        }
      );
    } catch (error) {
      store.setBleError(error.message || 'Failed to start Bluetooth scan.');
      store.setScanning(false);
    }
  }, []);

  const stopScan = useCallback(async () => {
    try {
      await bleService.stopScan();
    } catch {
      // Ignore stop scan errors when modal closes.
    }
    useBleStore.getState().setScanning(false);
  }, []);

  const handleConnect = async device => {
    const store = useBleStore.getState();
    store.setConnecting(true);
    store.setBleError(null);

    try {
      await stopScan();
      const connectedDevice = await bleService.connectToDevice(device.id);
      store.setConnected({
        id: connectedDevice.id,
        name: connectedDevice.name || connectedDevice.localName || device.name,
      });
      onClose();
    } catch (error) {
      store.setConnecting(false);
      store.setBleError(error.message || 'Failed to connect to device.');
    }
  };

  const handleClose = async () => {
    await stopScan();
    onClose();
  };

  useEffect(() => {
    if (visible) {
      useBleStore.getState().resetScan();
      startScan();
    } else {
      stopScan();
    }
  }, [visible, startScan, stopScan]);

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceRow}
      onPress={() => handleConnect(item)}
      disabled={isConnecting}
      activeOpacity={0.7}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceMeta}>Signal: {item.rssi ?? 'N/A'} dBm</Text>
      </View>
      {isConnecting ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Text style={styles.connectText}>Connect</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Connect Bluetooth Device</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {isConnected && connectedDeviceName ? (
            <Text style={styles.connectedBanner}>Connected to {connectedDeviceName}</Text>
          ) : null}

          {bleError ? <Text style={styles.errorText}>{bleError}</Text> : null}

          <View style={styles.scanRow}>
            {isScanning ? (
              <View style={styles.scanningRow}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.scanningText}>Scanning for nearby devices...</Text>
              </View>
            ) : (
              <Text style={styles.scanningText}>Scan stopped</Text>
            )}
            <TouchableOpacity style={styles.rescanButton} onPress={startScan} disabled={isConnecting}>
              <Text style={styles.rescanText}>Scan Again</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={scannedDevices}
            keyExtractor={item => item.id}
            renderItem={renderDevice}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {isScanning ? 'Searching for BLE devices...' : 'No devices found. Tap Scan Again.'}
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modal: {
    maxHeight: '80%',
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  closeText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  connectedBanner: {
    color: theme.colors.success,
    fontSize: 13,
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamily,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamily,
  },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    flex: 1,
  },
  scanningText: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontFamily: theme.typography.fontFamily,
  },
  rescanButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.lightGreen,
  },
  rescanText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  listContent: {
    paddingBottom: theme.spacing.m,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.s,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.background,
  },
  deviceInfo: {
    flex: 1,
    paddingRight: theme.spacing.s,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  deviceMeta: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  connectText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.l,
    fontFamily: theme.typography.fontFamily,
  },
});
