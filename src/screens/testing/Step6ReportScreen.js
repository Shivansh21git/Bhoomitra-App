import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';

export default function Step6ReportScreen({ navigation }) {
  const { farmerDetails, resetTestSession } = useTestStore();

  const handleDownloadReport = () => {
    Alert.alert("Report Downloaded", "The PDF report has been saved to your device.", [
      { text: "OK" }
    ]);
  };

  const handleDone = () => {
    resetTestSession();
    // Navigate back to the home or list
    navigation.navigate('TestingList');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Soil Test Report</Text>
          <Text style={styles.subtitle}>{farmerDetails.name} • {farmerDetails.farmName || 'Main Farm'}</Text>
        </View>

        {/* Map Placeholder */}
        <Card style={styles.mapCard}>
          <Ionicons name="map-outline" size={48} color={theme.colors.textLight} />
          <Text style={styles.mapTitle}>Satellite Map</Text>
          <Text style={styles.mapSub}>Sampling points are plotted here.</Text>
          
          <View style={[styles.mapPin, { top: 40, left: 60 }]} />
          <View style={[styles.mapPin, { top: 80, right: 80 }]} />
          <View style={[styles.mapPin, { bottom: 40, left: 100 }]} />
          <View style={[styles.mapPin, { top: 60, left: 180 }]} />
          <View style={[styles.mapPin, { bottom: 30, right: 60 }]} />
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg pH</Text>
              <Text style={styles.summaryValue}>7.1</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Org Carbon</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>0.5%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Health Score</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>Moderate</Text>
            </View>
          </View>
        </Card>

        {/* Point details */}
        <Text style={styles.sectionTitle}>Point-wise Health</Text>
        {[
          { id: '1', score: 'Excellent', color: theme.colors.success },
          { id: '2', score: 'Moderate', color: theme.colors.warning },
          { id: '3', score: 'Moderate', color: theme.colors.warning },
          { id: '4', score: 'Poor', color: theme.colors.error },
          { id: '5', score: 'Moderate', color: theme.colors.warning },
        ].map(item => (
          <View key={item.id} style={styles.pointRow}>
            <Text style={styles.pointText}>Point {item.id}</Text>
            <View style={[styles.badge, { backgroundColor: item.color }]}>
              <Text style={styles.badgeText}>{item.score}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Download PDF" 
          variant="outline"
          onPress={handleDownloadReport}
          style={styles.downloadBtn}
        />
        <Button 
          title="Done" 
          onPress={handleDone}
          style={styles.doneBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.m, paddingBottom: 100 },
  header: { marginBottom: theme.spacing.m, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
  subtitle: { fontSize: 16, color: theme.colors.textLight, marginTop: 4 },
  mapCard: { height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E1E4E8', overflow: 'hidden' },
  mapTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textLight, marginTop: 8 },
  mapSub: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  mapPin: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.error, borderWidth: 2, borderColor: '#fff' },
  summaryCard: { marginBottom: theme.spacing.xl },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.s },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 12, color: theme.colors.textLight, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.m },
  pointRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.card, padding: theme.spacing.m, marginBottom: theme.spacing.s, borderRadius: theme.borderRadius.m },
  pointText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.card, padding: theme.spacing.m, flexDirection: 'row', borderTopWidth: 1, borderTopColor: theme.colors.border },
  downloadBtn: { flex: 1, marginRight: theme.spacing.s },
  doneBtn: { flex: 1, marginLeft: theme.spacing.s }
});
