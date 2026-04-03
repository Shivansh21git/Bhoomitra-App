import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const RECENT_REPORTS = [
  { id: '1', date: '21 Mar 2026', farm: 'Ramesh Singh', score: 'Excellent', n: '45', p: '20', k: '150' },
  { id: '2', date: '19 Mar 2026', farm: 'Sunita Devi', score: 'Moderate', n: '38', p: '15', k: '120' },
  { id: '3', date: '15 Mar 2026', farm: 'Ali Khan', score: 'Poor', n: '20', p: '10', k: '90' },
  { id: '4', date: '12 Mar 2026', farm: 'Priya Sharma', score: 'Excellent', n: '48', p: '22', k: '160' },
  { id: '5', date: '10 Mar 2026', farm: 'Ravi Kumar', score: 'Moderate', n: '35', p: '14', k: '110' },
];

export default function ReportsScreen() {
  const getScoreColor = (score) => {
    if (score === 'Excellent') return theme.colors.success;
    if (score === 'Moderate') return theme.colors.warning;
    return theme.colors.error;
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.farm}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      
      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>N</Text>
          <Text style={styles.metricValue}>{item.n}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>P</Text>
          <Text style={styles.metricValue}>{item.p}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>K</Text>
          <Text style={styles.metricValue}>{item.k}</Text>
        </View>
        
        <View style={[styles.badge, { backgroundColor: getScoreColor(item.score) }]}>
          <Text style={styles.badgeText}>{item.score}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Ionicons name="download-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.downloadText}>Download PDF</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Historical Reports</Text>
        <Text style={styles.pageSubtitle}>View and download past soil tests.</Text>
      </View>
      
      <FlatList
        data={RECENT_REPORTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  pageHeader: { padding: theme.spacing.m, backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
  pageSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  list: { padding: theme.spacing.m },
  card: { padding: theme.spacing.m },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  date: { fontSize: 12, color: theme.colors.textLight },
  metrics: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: theme.spacing.s, borderRadius: theme.borderRadius.s },
  metricItem: { alignItems: 'center', marginRight: theme.spacing.l },
  metricLabel: { fontSize: 10, color: theme.colors.textLight },
  metricValue: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text },
  badge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.m, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: theme.spacing.sm },
  downloadText: { marginLeft: 4, color: theme.colors.primary, fontSize: 14, fontWeight: '600', marginTop: 8 }
});
