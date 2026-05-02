import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuthStore } from '../store/useAuthStore';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const logout = useAuthStore(state => state.logout);
  const userToken = useAuthStore(state => state.userToken);
  const userInfo = useAuthStore(state => state.userInfo);
  const userName = userInfo?.username || userInfo?.name || 'Nitika';

  const [homeData, setHomeData] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = useCallback(async (showLoader = false) => {
    if (!userToken) {
      setHomeData(null);
      setIsLoading(false);
      return;
    }

    if (showLoader) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await apiService.getHomeData(userToken);
      setHomeData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchHomeData(true);
  }, [fetchHomeData]);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData(false);
    }, [fetchHomeData])
  );

  useEffect(() => {
    const devices = homeData?.devices || [];
    if (devices.length === 0) {
      setSelectedDeviceId('');
      return;
    }

    setSelectedDeviceId(currentId => {
      const hasCurrent = devices.some(device => String(device.device_id ?? '') === currentId);
      if (hasCurrent) {
        return currentId;
      }
      return String(devices[0].device_id ?? '');
    });
  }, [homeData]);

  const devices = homeData?.devices || [];
  const selectedDevice = devices.find(device => String(device.device_id ?? '') === selectedDeviceId) || devices[0];
  const basicFields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity'];
  const advancedFields = ['nitrogen', 'phosphorus', 'potassium', 'ec', 'ph', 'soil_moisture', 'temperature', 'humidity'];
  const allowedFields = selectedDevice?.device_type === 'advanced' ? advancedFields : basicFields;
  const sensors = selectedDevice?.latest_data
    ? allowedFields
      .filter(k => selectedDevice.latest_data[k] !== undefined)
      .map(k => ({ key: k, value: String(selectedDevice.latest_data[k]) }))
    : [];

  return (
    <View style={styles.screen}>
      <View style={styles.navBar}>
        <Text style={styles.logo}>Bhoomitra</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Welcome, {homeData?.user?.username || userName}</Text>

        {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />}

        {error && (
          <Card style={{ backgroundColor: '#fee2e2' }}>
            <Text style={{ color: '#dc2626', textAlign: 'center' }}>{error}</Text>
          </Card>
        )}

        {!isLoading && !error && homeData && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Total Devices: {homeData.summary?.total_devices || 0} | Active: {homeData.summary?.active_devices || 0}</Text>

            {devices.length > 0 && (
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={selectedDeviceId}
                  onValueChange={value => setSelectedDeviceId(String(value))}
                  style={styles.picker}
                  dropdownIconColor={theme.colors.text}
                >
                  {devices.map((device, index) => (
                    <Picker.Item
                      key={String(device.device_id ?? index)}
                      label={device.name || `Device ${index + 1}`}
                      value={String(device.device_id ?? '')}
                    />
                  ))}
                </Picker>
              </View>
            )}

            {selectedDevice && (
              <View key={selectedDevice.device_id || selectedDeviceId} style={{ marginBottom: theme.spacing.xl }}>
                  <View style={styles.cardRow}>
                    <Card style={styles.halfCard}>
                      <Text style={styles.cardTitle}>Device Details</Text>
                      <View style={styles.dropdownPreview}>
                        <Text style={styles.dropdownText}>{selectedDevice.name}</Text>
                      </View>
                      <Text style={styles.deviceMeta}>Location: {selectedDevice.location}</Text>
                      <Text style={styles.deviceMeta}>Last Updated: {selectedDevice.last_updated}</Text>
                      <View style={styles.statusRow}>
                        <Text style={styles.deviceMeta}>Status:</Text>
                        <View style={[styles.badge, { backgroundColor: '#e8f5e9' }]}>
                          <Text style={[styles.badgeText, { color: '#2e7d32' }]}>
                            online
                          </Text>
                        </View>
                      </View>
                    </Card>

                    <Card style={styles.halfCard}>
                      <Text style={styles.cardTitle}>Soil Health</Text>
                      <Text style={styles.scoreNumber}>{selectedDevice.health_score ?? '-'}</Text>
                      <Text style={styles.poorLabel}>{selectedDevice.health_label || '-'}</Text>
                      <Button title="View Analytics" onPress={() => navigation.navigate('Analytics')} />
                    </Card>
                  </View>

                  <Card style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      {sensors.length > 0 ? sensors.map(sensor => (
                        <View key={sensor.key} style={styles.sensorCol}>
                          <Card style={styles.sensorCard}>
                            <Text style={styles.sensorName}>
                              {sensor.key.replace('_', ' ').toUpperCase()}
                            </Text>
                            <Text style={styles.sensorValue}>{sensor.value}</Text>
                          </Card>
                        </View>
                      )) : (
                        <Text style={styles.deviceMeta}>No sensor data available.</Text>
                      )}
                    </View>
                  </Card>
                </View>
            )}

            {(!homeData.devices || homeData.devices.length === 0) && (
              <Card>
                <Text style={{ textAlign: 'center', marginBottom: theme.spacing.m }}>No devices found.</Text>
                <Button title="+ View Analytics" onPress={() => navigation.navigate('Analytics')} />
              </Card>
            )}
          </>
        )}

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
  picker: {
    marginHorizontal: -8,
    color: theme.colors.text,
  },
  dropdownPreview: {
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
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -4,
  },

  sensorCol: {
    width: '25%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sensorCard: {
    height: 88,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  sensorName: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 4,
    textAlign: 'center',
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
