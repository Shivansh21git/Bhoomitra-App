import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { theme } from '../../theme/theme';
import Card from '../../components/Card';

const WIDTH = Dimensions.get('window').width - 64;

const makeSeries = (base) => Array.from({ length: 10 }, (_, i) => Number((base + (Math.sin(i) * 4) + (i * 0.25)).toFixed(1)));

function LineSensorChart({ title, values, stroke, fill }) {
  const width = WIDTH;
  const height = 150;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `${points} ${width},${height} 0,${height}`;

  return (
    <Card style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}: <Text style={styles.chartCurrent}>{values[values.length - 1]}</Text></Text>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={`${title}Fill`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={fill} stopOpacity="0.65" />
            <Stop offset="1" stopColor={fill} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        <Path d={`M ${areaPath}`} fill={`url(#${title}Fill)`} />
        <Polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </Card>
  );
}

function SemiDonut({ label, value, color }) {
  const total = 100;
  const clamped = Math.max(0, Math.min(value, total));
  const width = WIDTH;
  const radius = 80;
  const cx = width / 2;
  const cy = 95;
  const sweep = (clamped / total) * Math.PI;
  const x = cx - radius * Math.cos(sweep);
  const y = cy - radius * Math.sin(sweep);
  const largeArcFlag = clamped > 50 ? 1 : 0;
  const path = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`;

  return (
    <Card style={styles.chartCard}>
      <Text style={styles.chartTitle}>{label}</Text>
      <Svg width={width} height={120}>
        <Path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy}`} stroke="#e5e7eb" strokeWidth="14" fill="none" />
        <Path d={path} stroke={color} strokeWidth="14" fill="none" />
        <Rect x={0} y={0} width={0} height={0} />
      </Svg>
      <Text style={styles.centerValue}>{value}</Text>
    </Card>
  );
}

export default function DeviceDataScreen({ route, navigation }) {
  const deviceId = route?.params?.deviceId || 'BLE-Bhoomitra-001';
  const series = useMemo(() => ({
    Nitrogen: makeSeries(130),
    Phosphorus: makeSeries(22),
    Potassium: makeSeries(86),
    EC: makeSeries(1.3),
    pH: makeSeries(6.8),
    Moisture: makeSeries(38),
  }), []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Sensor Data for {deviceId}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <LineSensorChart title="Nitrogen" values={series.Nitrogen} stroke="rgba(255,99,132,1)" fill="rgba(255,99,132,0.2)" />
        <LineSensorChart title="Phosphorus" values={series.Phosphorus} stroke="rgba(54,162,235,1)" fill="rgba(54,162,235,0.2)" />
        <LineSensorChart title="Potassium" values={series.Potassium} stroke="rgba(255,206,86,1)" fill="rgba(255,206,86,0.2)" />
        <LineSensorChart title="EC" values={series.EC} stroke="rgba(153,102,255,1)" fill="rgba(153,102,255,0.2)" />
        <LineSensorChart title="pH" values={series.pH} stroke="rgba(46,125,50,1)" fill="rgba(46,125,50,0.2)" />
        <LineSensorChart title="Moisture" values={series.Moisture} stroke="rgba(0,188,212,1)" fill="rgba(0,188,212,0.2)" />
        <SemiDonut label="Temperature" value={29.4} color="rgba(255,159,64,1)" />
        <SemiDonut label="Humidity" value={61.0} color="rgba(75,192,192,1)" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topBar: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 12,
    backgroundColor: theme.colors.lightGreen,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.softAccent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  back: { color: theme.colors.primary, fontSize: 15, fontWeight: '700', fontFamily: theme.typography.fontFamily },
  header: { color: theme.colors.primary, fontSize: 16, fontWeight: '700', flex: 1, fontFamily: theme.typography.fontFamily },
  content: { padding: theme.spacing.m },
  chartCard: { backgroundColor: '#fff' },
  chartTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 8, fontFamily: theme.typography.fontFamily },
  chartCurrent: { color: theme.colors.primary },
  centerValue: { textAlign: 'center', marginTop: -30, color: theme.colors.primary, fontSize: 22, fontWeight: '700', fontFamily: theme.typography.fontFamily },
});
