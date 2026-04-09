import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAuthStore } from '../../store/useAuthStore';

const MOCK_DEVICES = [
  { id: 'BLE-Bhoomitra-001', name: 'Bhoomitra Sensor 001', location: 'Pune Field 2', status: 'online' },
  { id: 'BLE-Bhoomitra-002', name: 'Bhoomitra Sensor 002', location: 'Nashik Plot 5', status: 'offline' },
];

export default function Step1DeviceScreen({ navigation }) {
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', id: '', location: '' });
  const logout = useAuthStore(state => state.logout);
  const userName = 'Nitika';

  const refreshDeviceList = () => setDevices(prev => [...prev]);

  const handleSubmitDevice = async () => {
    if (!form.name.trim() || !form.id.trim()) {
      Alert.alert('Validation', 'Device Name and Device ID are required.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      id: form.id.trim(),
      location: form.location.trim(),
      status: 'online',
    };
    try {
      await fetch('https://example.com/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_error) {
      // Keep optimistic local update if API is unavailable.
    }
    setDevices(prev => [payload, ...prev]);
    refreshDeviceList();
    setForm({ name: '', id: '', location: '' });
    setShowForm(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.deviceCard}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>Device ID: {item.id}</Text>
      {item.location ? <Text style={styles.deviceLocation}>Location: {item.location}</Text> : null}
      <View style={styles.deviceFooter}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'online' ? '#e8f5e9' : '#ffebee' }]}>
          <Text style={[styles.statusText, { color: item.status === 'online' ? '#2e7d32' : '#dc2626' }]}>{item.status}</Text>
        </View>
      </View>
      <Button title="View Data" onPress={() => navigation.navigate('DeviceData', { deviceId: item.id })} />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>Welcome, {userName}</Text>
        <TouchableOpacity style={styles.inlineButton} onPress={() => setShowForm(prev => !prev)}>
          <Text style={styles.inlineButtonText}>+ Add New Device</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {showForm ? (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Device</Text>
          <TextInput
            placeholder="Device Name"
            placeholderTextColor={theme.colors.textLight}
            value={form.name}
            onChangeText={(value) => setForm(prev => ({ ...prev, name: value }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Device ID"
            placeholderTextColor={theme.colors.textLight}
            value={form.id}
            onChangeText={(value) => setForm(prev => ({ ...prev, id: value }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Location"
            placeholderTextColor={theme.colors.textLight}
            value={form.location}
            onChangeText={(value) => setForm(prev => ({ ...prev, location: value }))}
            style={styles.input}
          />
          <Button title="Submit Device" onPress={handleSubmitDevice} />
        </Card>
      ) : null}

      <View style={styles.listWrap}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No devices found.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  logoutText: {
    alignSelf: 'flex-end',
    color: theme.colors.primary,
    fontSize: 14,
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamily,
  },
  inlineButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  inlineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  formCard: { marginBottom: theme.spacing.m },
  formTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.s, fontFamily: theme.typography.fontFamily },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: '#fff',
  },
  listWrap: { flex: 1 },
  list: {
    paddingBottom: theme.spacing.l,
  },
  deviceCard: {
    borderRadius: 12,
    padding: theme.spacing.m,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  deviceId: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
    fontFamily: theme.typography.fontFamily,
  },
  deviceLocation: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamily,
  },
  deviceFooter: { marginBottom: theme.spacing.s },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.l,
    fontFamily: theme.typography.fontFamily,
  }
});
