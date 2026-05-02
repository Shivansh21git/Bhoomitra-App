import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { theme } from '../theme/theme';
import Card from '../components/Card';

const AREA_GRAPH_METRICS = [
  { title: 'Nitrogen', value: '32.7', color: '#2f7d33', from: '#7bbf87', to: '#d9f2df', data: [24, 42, 44, 32, 12, 9, 27, 44, 53, 45] },
  { title: 'Phosphorus', value: '18.4', color: '#3972d9', from: '#84a8f2', to: '#e0e9ff', data: [26, 31, 28, 24, 20, 16, 23, 28, 35, 30] },
  { title: 'Potassium', value: '46.2', color: '#9c6ad8', from: '#b08ce4', to: '#eee4fa', data: [22, 27, 34, 38, 29, 25, 31, 40, 46, 42] },
  { title: 'EC', value: '1.12', color: '#0f8d83', from: '#61c9c0', to: '#ddf8f5', data: [14, 15, 19, 24, 21, 18, 20, 26, 28, 24] },
  { title: 'pH', value: '6.8', color: '#cf8a2a', from: '#f4c47d', to: '#fdeed8', data: [35, 33, 31, 29, 28, 30, 31, 34, 36, 35] },
  { title: 'Soil Moisture', value: '41.9', color: '#07a9df', from: '#6ed9ff', to: '#dff8ff', data: [20, 35, 37, 24, 7, 4, 21, 39, 48, 37] },
];

const GAUGE_METRICS = [
  { title: 'Temperature', value: '29.4', progress: 0.34, color: '#f6a73f', unit: ' C' },
  { title: 'Humidity', value: '62.8', progress: 0.72, color: '#36bbd8', unit: ' %' },
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

function GaugeCard({ title, value, progress, color, unit = '' }) {
  const radius = 82;
  const strokeWidth = 16;
  const circumference = Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const progressOffset = circumference * (1 - clampedProgress);
  const centerX = 112;
  const centerY = 110;

  return (
    <Card style={styles.gaugeCard}>
      <Text style={styles.gaugeTitle}>{title}</Text>
      <View style={styles.gaugeWrap}>
        <Svg width={224} height={134}>
          <Path
            d={`M ${centerX - radius},${centerY} A ${radius},${radius} 0 0 1 ${centerX + radius},${centerY}`}
            stroke="#eceff3"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${centerX - radius},${centerY} A ${radius},${radius} 0 0 1 ${centerX + radius},${centerY}`}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progressOffset}
          />
          <Circle cx={centerX} cy={centerY} r={3} fill="#d1d5db" />
        </Svg>
        <Text style={[styles.gaugeValue, { color }]}>
          {value}
          {unit}
        </Text>
      </View>
    </Card>
  );
}

export default function AnalyticsScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(210, width - 72);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {AREA_GRAPH_METRICS.map(metric => (
          <SparklineCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            strokeColor={metric.color}
            gradientFrom={metric.from}
            gradientTo={metric.to}
            chartWidth={chartWidth}
            points={metric.data}
          />
        ))}
        {GAUGE_METRICS.map(metric => (
          <GaugeCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            progress={metric.progress}
            color={metric.color}
            unit={metric.unit}
          />
        ))}
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
  gaugeCard: {
    borderRadius: theme.borderRadius.m,
    borderColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.sm,
  },
  gaugeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
    fontFamily: theme.typography.fontFamily,
  },
  gaugeWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  gaugeValue: {
    marginTop: -22,
    fontSize: 38,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
});
