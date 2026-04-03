import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';

const MOCK_DEVICES = [
  { id: 'BLE-Bhoomitra-001', name: 'Bhoomitra Sensor 001', battery: 85 },
  { id: 'BLE-Bhoomitra-002', name: 'Bhoomitra Sensor 002', battery: 62 },
];

export default function Step1DeviceScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { connectDevice, deviceConnected } = useTestStore();

  useEffect(() => {
    // Simulate BLE scanning
    const scanTimer = setTimeout(() => {
      setDevices(MOCK_DEVICES);
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(scanTimer);
  }, []);

  const handleConnect = () => {
    if (selectedDevice) {
      connectDevice(selectedDevice);
      navigation.navigate('Step2');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedDevice(item)} activeOpacity={0.8}>
      <Card style={[styles.deviceCard, selectedDevice?.id === item.id && styles.selectedCard]}>
        <View style={styles.deviceInfo}>
          <Ionicons name="bluetooth" size={24} color={selectedDevice?.id === item.id ? theme.colors.success : theme.colors.textLight} />
          <View style={styles.deviceText}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceId}>ID: {item.id}</Text>
          </View>
        </View>
        <View style={styles.batteryInfo}>
          <Ionicons name="battery-charged" size={20} color={item.battery > 20 ? theme.colors.success : theme.colors.error} />
          <Text style={styles.batteryText}>{item.battery}%</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Soil Sensor</Text>
      <Text style={styles.subtitle}>Turn on your device and ensure Bluetooth is enabled on your phone.</Text>

      {isScanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.scanningText}>Scanning for nearby devices...</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No devices found. Try resetting your sensor.</Text>}
        />
      )}

      <View style={styles.footer}>
        <Button 
          title={isScanning ? "Scanning..." : "Connect & Continue"} 
          onPress={handleConnect}
          style={{ opacity: selectedDevice ? 1 : 0.5 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.l,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    marginTop: theme.spacing.m,
    color: theme.colors.textLight,
    fontSize: 16,
  },
  list: {
    paddingBottom: theme.spacing.xxl,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: theme.colors.success,
    backgroundColor: '#f0fdf4', // light success background
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceText: {
    marginLeft: theme.spacing.m,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  deviceId: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  batteryInfo: {
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.m,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.xl,
  }
});
