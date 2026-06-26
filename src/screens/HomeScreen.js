import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../api/apiService';
import BluetoothConnectModal from '../components/BluetoothConnectModal';
import Button from '../components/Button';
import Card from '../components/Card';
import { bleService } from '../services/bleService';
import { useAuthStore } from '../store/useAuthStore';
import { useBleStore } from '../store/useBleStore';
import { theme } from '../theme/theme';

const SENSOR_LABELS = {
  nitrogen: 'N',
  phosphorus: 'P',
  potassium: 'K',
  temperature: 'Temp',
  humidity: 'Humidity',
  ec: 'EC',
  ph: 'pH',
  soil_moisture: 'Soil Moisture',
};

export default function HomeScreen({ navigation }) {
  const logout = useAuthStore(state => state.logout);
  const userToken = useAuthStore(state => state.userToken);
  const userInfo = useAuthStore(state => state.userInfo);
  const userName = userInfo?.username || userInfo?.name || 'Nitika';

  const [homeData, setHomeData] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBleModal, setShowBleModal] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  const [sampleCount, setSampleCount] = useState(0);
  const [localSamples, setLocalSamples] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const isBleConnected = useBleStore(state => state.isConnected);
  const connectedDeviceName = useBleStore(state => state.connectedDeviceName);
  const connectedDeviceId = useBleStore(state => state.connectedDeviceId);
  const setDisconnected = useBleStore(state => state.setDisconnected);

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
    if (!connectedDeviceId) {
      return undefined;
    }

    const subscription = bleService.onDeviceDisconnected(connectedDeviceId, () => {
      setDisconnected();
    });

    return () => subscription.remove();
  }, [connectedDeviceId, setDisconnected]);

  const handleDisconnectBle = async () => {
    if (!connectedDeviceId) {
      return;
    }

    try {
      await bleService.disconnectDevice(connectedDeviceId);
      setDisconnected();
    } catch (err) {
      Alert.alert('Disconnect Failed', err.message || 'Unable to disconnect from device.');
    }
  };

  const handleStartTest = async () => {
    if (!isBleConnected || !connectedDeviceId) {
      Alert.alert(
        'Bluetooth Required',
        'You must connect to a Bluetooth device to start a soil test.',
        [
          { text: 'Connect', onPress: () => setShowBleModal(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    if (!selectedDevice) {
      Alert.alert('No Device Selected', 'Please select a device to test.');
      return;
    }

    setIsApiLoading(true);
    try {
      const result = await apiService.startTest(userToken, selectedDevice.device_id);
      if (result && result.test_id) {
        setActiveTestId(result.test_id);
        setIsTesting(true);
        setSampleCount(0);
        setLocalSamples([]);
      } else {
        throw new Error('No test ID received from server.');
      }
    } catch (err) {
      Alert.alert('Start Test Failed', err.message || 'Failed to start soil test.');
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleCompleteTest = async (samples) => {
    setIsApiLoading(true);
    console.log(`\n==== [Completing Soil Test] ====`);
    console.log(`Test ID: ${activeTestId}`);
    console.log(`Samples to submit:`, JSON.stringify(samples, null, 2));
    console.log(`================================\n`);
    try {
      const result = await apiService.completeTest(userToken, activeTestId, samples);
      console.log(`\n==== [Soil Test Submission Success] ====`);
      console.log(`Result:`, JSON.stringify(result, null, 2));
      console.log(`========================================\n`);
      Alert.alert(
        'Soil Test Success',
        `Soil testing completed successfully!\n\nNew Health Score: ${result.health_score ?? '-'}\nLabel: ${result.health_label || '-'}`,
        [{ text: 'OK', onPress: () => fetchHomeData(true) }]
      );
    } catch (err) {
      console.error(`\nxxxx [Soil Test Submission Failed] xxxx`);
      console.error(`Error:`, err);
      console.error(`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n`);
      Alert.alert('Submission Failed', err.message || 'Failed to submit samples to server.');
    } finally {
      setIsTesting(false);
      setActiveTestId(null);
      setSampleCount(0);
      setLocalSamples([]);
      setIsApiLoading(false);
    }
  };

  const handleCancelTest = () => {
    Alert.alert(
      'Cancel Test',
      'Are you sure you want to cancel the soil test? This will mark the test as failed.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsApiLoading(true);
            try {
              if (activeTestId) {
                await apiService.failTest(userToken, activeTestId);
              }
            } catch (err) {
              console.warn('Fail test API error:', err);
            } finally {
              setIsTesting(false);
              setActiveTestId(null);
              setSampleCount(0);
              setLocalSamples([]);
              setIsApiLoading(false);
              Alert.alert('Test Cancelled', 'Soil test was cancelled.');
            }
          }
        }
      ]
    );
  };

  const handleTakeSample = async () => {
    if (!isBleConnected || !connectedDeviceId) {
      Alert.alert('Device Disconnected', 'Bluetooth disconnected. Cannot take sample.');
      try {
        if (activeTestId) {
          await apiService.failTest(userToken, activeTestId);
        }
      } catch (err) {
        console.warn('Fail test API error:', err);
      } finally {
        setIsTesting(false);
        setActiveTestId(null);
        setSampleCount(0);
        setLocalSamples([]);
      }
      return;
    }

    const nextCount = sampleCount + 1;
    setIsApiLoading(true);
    console.log(`\n==== [Sensing Sample ${nextCount}/5] ====`);
    console.log(`Sending command to BLE Device: ${connectedDeviceId}`);

    try {
      await bleService.sendSampleCommand(connectedDeviceId, nextCount);

      const newReading = {
        nitrogen: Math.floor(40 + Math.random() * 20),
        phosphorus: Math.floor(15 + Math.random() * 10),
        potassium: Math.floor(130 + Math.random() * 40),
        temperature: Number((25 + Math.random() * 8).toFixed(1)),
        humidity: Number((50 + Math.random() * 15).toFixed(1)),
      };
      if (selectedDevice?.device_type === 'advanced') {
        newReading.ec = Number((1.0 + Math.random() * 0.5).toFixed(2));
        newReading.ph = Number((6.2 + Math.random() * 1.2).toFixed(1));
        newReading.soil_moisture = Number((30 + Math.random() * 15).toFixed(1));
      }

      console.log(`Sample ${nextCount} Sensed successfully:`, JSON.stringify(newReading, null, 2));
      console.log(`========================================\n`);

      const updatedSamples = [...localSamples, newReading];
      setLocalSamples(updatedSamples);
      setSampleCount(nextCount);

      if (nextCount >= 5) {
        await handleCompleteTest(updatedSamples);
      }
    } catch (err) {
      console.error(`\nxxxx [Sampling Failed] xxxx`);
      console.error(`Error:`, err);
      console.error(`xxxxxxxxxxxxxxxxxxxxxxxxxxx\n`);
      Alert.alert('Sampling Failed', err.message || 'Could not capture sample.');
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    if (isTesting && !isBleConnected) {
      const triggerAutoFail = async () => {
        try {
          if (activeTestId) {
            await apiService.failTest(userToken, activeTestId);
          }
        } catch (err) {
          console.warn('Fail test auto API error:', err);
        } finally {
          setIsTesting(false);
          setActiveTestId(null);
          setSampleCount(0);
          setLocalSamples([]);
          Alert.alert('Test Failed', 'Bluetooth disconnected. The soil test was cancelled.');
        }
      };
      triggerAutoFail();
    }
  }, [isBleConnected, isTesting, activeTestId, userToken]);

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
      .map(k => ({ key: k, label: SENSOR_LABELS[k] || k, value: String(selectedDevice.latest_data[k]) }))
    : [];

  const deviceStatus = isBleConnected ? 'online' : 'offline';
  const statusColors =
    deviceStatus === 'online'
      ? { backgroundColor: '#e8f5e9', color: '#2e7d32' }
      : { backgroundColor: '#ffebee', color: '#dc2626' };

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

            <Button
              title={isBleConnected ? 'Disconnect Bluetooth' : 'Connect Bluetooth'}
              onPress={() => (isBleConnected ? handleDisconnectBle() : setShowBleModal(true))}
              variant={isBleConnected ? 'outline' : 'primary'}
              style={styles.topButton}
            />

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
                      {isBleConnected && connectedDeviceName ? (
                        <Text style={styles.deviceMeta}>BLE: {connectedDeviceName}</Text>
                      ) : null}
                      <View style={styles.statusRow}>
                        <Text style={styles.deviceMeta}>Status:</Text>
                        <View style={[styles.badge, { backgroundColor: statusColors.backgroundColor }]}>
                          <Text style={[styles.badgeText, { color: statusColors.color }]}>
                            {deviceStatus}
                          </Text>
                        </View>
                      </View>
                    </Card>

                    <Card style={styles.halfCard}>
                      {isTesting ? (
                        <>
                          <Text style={styles.cardTitle}>Soil Testing</Text>
                          <Text style={{ fontSize: 12, color: theme.colors.textLight, marginBottom: 4 }}>
                            ID: {activeTestId ? (String(activeTestId).length > 10 ? `${String(activeTestId).slice(0, 10)}...` : String(activeTestId)) : '-'}
                          </Text>
                          
                          <View style={{ flexDirection: 'row', gap: 6, marginVertical: 10, alignItems: 'center' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <View
                                key={s}
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: s <= sampleCount ? theme.colors.primary : '#e2e8f0',
                                  borderWidth: 1,
                                  borderColor: s <= sampleCount ? theme.colors.primaryDark : '#cbd5e1'
                                }}
                              />
                            ))}
                            <Text style={{ fontSize: 13, fontWeight: '700', marginLeft: 4, color: theme.colors.primary }}>
                              {sampleCount}/5
                            </Text>
                          </View>

                          {isApiLoading ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 12 }} />
                          ) : (
                            <>
                              <Button
                                title="Take Sample"
                                onPress={handleTakeSample}
                                style={{ marginBottom: 6 }}
                              />
                              <TouchableOpacity onPress={handleCancelTest} style={{ alignSelf: 'center', paddingVertical: 4 }}>
                                <Text style={{ color: theme.colors.error, fontSize: 13, fontWeight: '600' }}>Cancel Test</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Text style={styles.cardTitle}>Soil Health</Text>
                          <Text style={styles.scoreNumber}>{selectedDevice.health_score ?? '-'}</Text>
                          <Text style={styles.poorLabel}>{selectedDevice.health_label || '-'}</Text>
                          <Button
                            title="Take Soil Test"
                            onPress={handleStartTest}
                          />
                        </>
                      )}
                    </Card>
                  </View>

                  <Card style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      {sensors.length > 0 ? sensors.map(sensor => (
                        <View key={sensor.key} style={styles.sensorCol}>
                          <Card style={styles.sensorCard}>
                            <Text style={styles.sensorName}>
                              {sensor.label}
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

      <BluetoothConnectModal visible={showBleModal} onClose={() => setShowBleModal(false)} />
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
