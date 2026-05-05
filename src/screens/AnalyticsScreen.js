import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { apiService } from '../api/apiService';
import { useAuthStore } from '../store/useAuthStore';
import { theme } from '../theme/theme';
import Card from '../components/Card';

const SENSOR_STYLES = [
  { key: 'nitrogen', title: 'Nitrogen', color: '#2f7d33', from: '#7bbf87', to: '#d9f2df' },
  { key: 'phosphorus', title: 'Phosphorus', color: '#3972d9', from: '#84a8f2', to: '#e0e9ff' },
  { key: 'potassium', title: 'Potassium', color: '#9c6ad8', from: '#b08ce4', to: '#eee4fa' },
  { key: 'temperature', title: 'Temperature', color: '#f6a73f', from: '#f4c47d', to: '#fdeed8' },
  { key: 'humidity', title: 'Humidity', color: '#36bbd8', from: '#6ed9ff', to: '#dff8ff' },
  { key: 'ec', title: 'EC', color: '#0f8d83', from: '#61c9c0', to: '#ddf8f5' },
  { key: 'ph', title: 'pH', color: '#cf8a2a', from: '#f4c47d', to: '#fdeed8' },
  { key: 'soil_moisture', title: 'Soil Moisture', color: '#07a9df', from: '#6ed9ff', to: '#dff8ff' },
];

function SparklineCard({ title, value, strokeColor, gradientFrom, gradientTo, chartWidth, points }) {
  const chartHeight = 124;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const stepX = chartWidth / (points.length - 1);

  const pathPoints = points
    .map((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point - min) / range) * (chartHeight - 18) - 8;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `M0,${chartHeight} L${pathPoints} L${chartWidth},${chartHeight} Z`;
  const strokePath = `M${pathPoints}`;
  const gradientId = `${title}-gradient-${strokeColor.replace('#', '')}`;

  return (
    <Card style={styles.chartCard}>
      <Text style={styles.cardTitle}>{title}: {value}</Text>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={gradientFrom} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={gradientTo} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path d={strokePath} fill="none" stroke={strokeColor} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </Card>
  );
}

function HealthGraphCard({ chartWidth, points }) {
  const chartHeight = 124;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const stepX = chartWidth / Math.max(points.length - 1, 1);
  const pathPoints = points
    .map((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point - min) / range) * (chartHeight - 18) - 8;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `M0,${chartHeight} L${pathPoints} L${chartWidth},${chartHeight} Z`;
  const strokePath = `M${pathPoints}`;

  return (
    <Card style={styles.chartCard}>
      <Text style={styles.cardTitle}>Health Score</Text>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="health-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#85b7ff" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#e7f0ff" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#health-gradient)" />
        <Path d={strokePath} fill="none" stroke="#2459c6" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </Card>
  );
}

export default function AnalyticsScreen() {
  const route = useRoute();
  const { width } = useWindowDimensions();
  const userToken = useAuthStore(state => state.userToken);
  const initialDeviceId = route.params?.deviceId ? String(route.params.deviceId) : '';

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartWidth = Math.max(210, width - 72);

  useEffect(() => {
    if (initialDeviceId) {
      setSelectedDeviceId(initialDeviceId);
    }
  }, [initialDeviceId]);

  const fetchDevices = useCallback(async () => {
    if (!userToken) {
      setDevices([]);
      return;
    }
    const homeData = await apiService.getHomeData(userToken);
    const nextDevices = homeData?.devices || [];
    setDevices(nextDevices);
    setSelectedDeviceId(currentId => {
      if (currentId && nextDevices.some(d => String(d.device_id) === currentId)) {
        return currentId;
      }
      return nextDevices.length > 0 ? String(nextDevices[0].device_id) : '';
    });
  }, [userToken]);

  const fetchAnalytics = useCallback(async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fetchDevices();
    } catch (err) {
      setError(err.message || 'Failed to fetch device list');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [fetchDevices, userToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics])
  );

  useEffect(() => {
    const loadDeviceAnalytics = async () => {
      if (!userToken || !selectedDeviceId) {
        setAnalyticsData(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiService.getDeviceAnalytics(userToken, selectedDeviceId);
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    loadDeviceAnalytics();
  }, [selectedDeviceId, userToken]);

  const selectedDeviceType = analyticsData?.device_type || 'basic';
  const sensorMetrics = useMemo(() => {
    const baseOrder = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity'];
    const advancedOnly = ['ec', 'ph', 'soil_moisture'];
    const keys = selectedDeviceType === 'advanced' ? [...baseOrder, ...advancedOnly] : baseOrder;
    const sensorData = analyticsData?.sensor_data || {};

    return keys
      .map(key => {
        const style = SENSOR_STYLES.find(item => item.key === key);
        const points = Array.isArray(sensorData[key]) ? sensorData[key].map(n => Number(n)).filter(n => !Number.isNaN(n)) : [];
        if (!style || points.length === 0) {
          return null;
        }
        return {
          ...style,
          points,
          value: String(points[points.length - 1]),
        };
      })
      .filter(Boolean);
  }, [analyticsData, selectedDeviceType]);

  const healthScores = Array.isArray(analyticsData?.health_data?.scores)
    ? analyticsData.health_data.scores.map(n => Number(n)).filter(n => !Number.isNaN(n))
    : [];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

        {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />}

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        {!isLoading && !error && sensorMetrics.map(metric => (
          <SparklineCard
            key={metric.key}
            title={metric.title}
            value={metric.value}
            strokeColor={metric.color}
            gradientFrom={metric.from}
            gradientTo={metric.to}
            chartWidth={chartWidth}
            points={metric.points}
          />
        ))}

        {!isLoading && !error && healthScores.length > 0 && (
          <HealthGraphCard chartWidth={chartWidth} points={healthScores} />
        )}

        {!isLoading && !error && devices.length === 0 && (
          <Card>
            <Text style={styles.emptyText}>No devices found for analytics.</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6fbf7',
  },
  content: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: theme.spacing.sm,
  },
  picker: {
    marginHorizontal: -8,
    color: theme.colors.text,
  },
  chartCard: {
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily,
  },
  errorCard: {
    backgroundColor: '#fee2e2',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
});
