import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';

export default function HomeScreen({ navigation }) {
  // Mock User
  const userName = "Nitika";
  const soilHealthScore = 82;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Namaste, {userName}</Text>
        <Text style={styles.subtitle}>Welcome back to Bhoomitra</Text>
      </View>

      {/* CTA Card */}
      <Card style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Ready for a Soil Test?</Text>
        <Text style={styles.ctaSubtitle}>Connect your sensor to begin.</Text>
        <Button 
          title="Start Soil Test" 
          onPress={() => navigation.navigate('TestingTab')}
        />
      </Card>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Health Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.statValue}>{soilHealthScore}</Text>
            <Text style={styles.statSubValue}>/100</Text>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Tests (30 Days)</Text>
          <Text style={[styles.statValue, { color: theme.colors.accent }]}>24</Text>
        </Card>
      </View>

      {/* Farm Services Grid */}
      <Text style={styles.sectionTitle}>Farm Services</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Reports')}>
          <View style={[styles.iconBox, { backgroundColor: '#e6f2ff' }]}>
            <Ionicons name="document-text" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.gridText}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#e6ffe6' }]}>
            <Ionicons name="hardware-chip" size={24} color={theme.colors.success} />
          </View>
          <Text style={styles.gridText}>Kit Rental</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#fff2e6' }]}>
            <Ionicons name="leaf" size={24} color={theme.colors.warning} />
          </View>
          <Text style={styles.gridText}>Crop Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#ffe6e6' }]}>
            <Ionicons name="color-wand" size={24} color={theme.colors.error} />
          </View>
          <Text style={styles.gridText}>AI Advisor</Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <Text style={styles.sectionTitle}>Farm Locations</Text>
      <Card style={styles.mapCard}>
        <Ionicons name="map" size={48} color={theme.colors.textLight} />
        <Text style={styles.mapText}>Map Preview Unavailable</Text>
        <Text style={styles.mapSubText}>Connect to internet to load farm locations.</Text>
      </Card>
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.m,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  ctaCard: {
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.l,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.card,
    marginBottom: theme.spacing.xs,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: theme.spacing.l,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.s,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  statSubValue: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.s,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  gridItem: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    ...theme.shadows.soft,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  mapCard: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAECEF',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: theme.spacing.m,
  },
  mapSubText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  }
});
