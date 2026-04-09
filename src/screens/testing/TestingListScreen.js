import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';

const mockTests = [
  { id: '1', farmer: 'Ramesh Singh', location: 'Pune HQ', score: 'Excellent', date: '21 Mar 2026' },
  { id: '2', farmer: 'Sunita Devi', location: 'Nashik', score: 'Moderate', date: '19 Mar 2026' },
  { id: '3', farmer: 'Ali Khan', location: 'Aurangabad', score: 'Poor', date: '15 Mar 2026' },
];

export default function TestingListScreen({ navigation }) {
  const resetTestSession = useTestStore(state => state.resetTestSession);

  const startNewTest = () => {
    resetTestSession();
    navigation.navigate('Step1');
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'Excellent': return theme.colors.success;
      case 'Moderate': return theme.colors.warning;
      case 'Poor': return theme.colors.error;
      default: return theme.colors.textLight;
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.testCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.farmerName}>{item.farmer}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.locationText}>
        <Ionicons name="location-outline" size={14} /> {item.location}
      </Text>
      <View style={[styles.badge, { backgroundColor: getScoreColor(item.score) }]}>
        <Text style={styles.badgeText}>{item.score}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockTests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No previous tests found.</Text>}
      />
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={startNewTest} activeOpacity={0.8}>
          <Ionicons name="add" size={32} color={theme.colors.card} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  testCard: {
    padding: theme.spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.s,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.s,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    color: theme.colors.textLight,
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.m,
    right: theme.spacing.m,
  },
  fab: {
    backgroundColor: theme.colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
});
