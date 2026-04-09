import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function HomeScreen({ navigation }) {
  const logout = useAuthStore(state => state.logout);
  const userName = 'Nitika';
  const device = { name: 'Bhoomitra Sensor 001', id: 'BLE-Bhoomitra-001', location: 'Pune Field 2', status: 'online' };
  const sensors = useMemo(() => ([
    { key: 'Nitrogen', value: '135.6', state: 'Optimal', color: '#2e7d32' },
    { key: 'Phosphorus', value: '24.8', state: 'Low', color: '#dc2626' },
    { key: 'Potassium', value: '88.2', state: 'High', color: '#f59e0b' },
    { key: 'Temperature', value: '29.4 C', state: 'Optimal', color: '#2e7d32' },
    { key: 'Humidity', value: '61.0%', state: 'Optimal', color: '#2e7d32' },
  ]), []);

  return (
    <View style={styles.screen}>
      <View style={styles.navBar}>
        <Text style={styles.logo}>Bhoomitra</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Welcome, {userName}</Text>

        <View style={styles.cardRow}>
          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Soil Health Score</Text>
            <Text style={styles.scoreNumber}>40</Text>
            <Text style={styles.poorLabel}>Poor Condition</Text>
            <Text style={styles.updatedText}>Last updated: just now</Text>
            <Button title="Start Soil Test" onPress={() => navigation.navigate('TestingTab')} />
          </Card>

          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Active Device</Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>{device.name}</Text>
            </View>
            <Text style={styles.deviceMeta}>Name: {device.name}</Text>
            <Text style={styles.deviceMeta}>Device ID: {device.id}</Text>
            <Text style={styles.deviceMeta}>Location: {device.location}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.deviceMeta}>Status:</Text>
              <View style={[styles.badge, { backgroundColor: device.status === 'online' ? '#e8f5e9' : '#ffebee' }]}>
                <Text style={[styles.badgeText, { color: device.status === 'online' ? '#2e7d32' : '#dc2626' }]}>
                  {device.status}
                </Text>
              </View>
            </View>
            <Button title="View Previous Data ->" variant="outline" onPress={() => navigation.navigate('DeviceData', { deviceId: device.id })} style={styles.topButton} />
            <Button title="+ Add New Device" onPress={() => navigation.navigate('Step1')} />
          </Card>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {sensors.map(sensor => (
              <View key={sensor.key} style={styles.sensorCol}>
                <Text style={styles.sensorName}>{sensor.key}</Text>
                <Text style={styles.sensorValue}>{sensor.value}</Text>
                <Text style={[styles.sensorState, { color: sensor.color }]}>{sensor.state}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.recommendCard}>
          <View style={styles.recommendAccent} />
          <View style={styles.recommendBody}>
            <Text style={styles.recommendTitle}>Recommended Action</Text>
            <Text style={styles.recommendText}>
              Based on current soil condition, corrective actions will be shown here.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  navBar: {
    backgroundColor: theme.colors.lightGreen,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.softAccent,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  logoutText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.m,
  },
  greeting: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  halfCard: {
    flexBasis: '49%',
    flexGrow: 1,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.s,
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  },
  poorLabel: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
  },
  updatedText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.m,
    fontFamily: theme.typography.fontFamily,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: theme.spacing.s,
  },
  dropdownText: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  deviceMeta: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  badge: {
    marginLeft: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  topButton: {
    marginBottom: theme.spacing.s,
  },
  summaryCard: {
    marginBottom: theme.spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  sensorCol: {
    minWidth: '18%',
    flexGrow: 1,
  },
  sensorName: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  sensorState: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  recommendCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  recommendAccent: {
    width: 6,
    backgroundColor: theme.colors.primary,
  },
  recommendBody: {
    padding: theme.spacing.m,
    flex: 1,
  },
  recommendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
    fontFamily: theme.typography.fontFamily,
  },
  recommendText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
});
