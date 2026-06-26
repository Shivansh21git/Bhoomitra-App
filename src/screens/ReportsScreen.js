import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../api/apiService';
import { useAuthStore } from '../store/useAuthStore';

export default function ReportsScreen() {
  const userToken = useAuthStore(state => state.userToken);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!userToken) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.getReports(userToken);
      setReports(Array.isArray(data?.reports) ? data.reports : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  const getScoreColor = (score) => {
    if (score === 'Excellent') return theme.colors.success;
    if (score === 'Moderate') return theme.colors.warning;
    return theme.colors.error;
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.device_name || '-'}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      
      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>N</Text>
          <Text style={styles.metricValue}>{item?.npk?.nitrogen ?? '-'}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>P</Text>
          <Text style={styles.metricValue}>{item?.npk?.phosphorus ?? '-'}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>K</Text>
          <Text style={styles.metricValue}>{item?.npk?.potassium ?? '-'}</Text>
        </View>
        {item.device_type === 'advanced' && (
          <>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>pH</Text>
              <Text style={styles.metricValue}>{item?.npk?.ph ?? '-'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>EC</Text>
              <Text style={styles.metricValue}>{item?.npk?.ec ?? '-'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Moist</Text>
              <Text style={styles.metricValue}>{item?.npk?.soil_moisture ?? '-'}</Text>
            </View>
          </>
        )}
        
        <View style={[styles.badge, { backgroundColor: getScoreColor(item?.health?.label) }]}>
          <Text style={styles.badgeText}>{item?.health?.label || '-'}</Text>
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
        data={reports}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchReports}
        ListHeaderComponent={isLoading ? <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={
          !isLoading ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>{error || 'No reports found.'}</Text>
            </Card>
          ) : null
        }
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
  metrics: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#F8F9FA', padding: theme.spacing.s, borderRadius: theme.borderRadius.s, gap: 12 },
  metricItem: { alignItems: 'center' },
  metricLabel: { fontSize: 10, color: theme.colors.textLight },
  metricValue: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text },
  badge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.m, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: theme.spacing.sm },
  downloadText: { marginLeft: 4, color: theme.colors.primary, fontSize: 14, fontWeight: '600', marginTop: 8 },
  loader: { marginBottom: theme.spacing.m },
  emptyCard: { marginTop: theme.spacing.s },
  emptyText: { textAlign: 'center', color: theme.colors.textLight }
});
