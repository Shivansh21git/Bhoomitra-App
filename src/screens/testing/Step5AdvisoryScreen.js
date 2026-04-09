import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';
import { Ionicons } from '@expo/vector-icons';

export default function Step5AdvisoryScreen({ navigation }) {
  const { setAdvisory, farmerDetails } = useTestStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock AI Backend call
    const timer = setTimeout(() => {
      const mockResult = {
        status: 'Moderate',
        fertilizerPlan: [
          { name: 'Urea (46% N)', nutrient: 'N', quantity: '25 kg/acre' },
          { name: 'DAP (18-46-0)', nutrient: 'P', quantity: '15 kg/acre' },
          { name: 'MOP (60% K)', nutrient: 'K', quantity: '10 kg/acre' },
        ],
        crops: [
          { name: 'Wheat', match: 92 },
          { name: 'Soybean', match: 85 },
          { name: 'Cotton', match: 78 },
        ],
        tips: [
          'Rotate crops to leguminous plants to fix nitrogen organically.',
          'Consider deep plowing to improve organic carbon mixing.',
          'Micro-irrigation recommended for current soil type.',
        ]
      };
      setAdvisory(mockResult);
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    navigation.navigate('Step6');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Bhoomitra AI is analyzing your soil data...</Text>
      </View>
    );
  }

  // Assuming data is now loaded and available via store or local state
  const mockData = {
    status: 'Moderate',
    fertilizerPlan: [
      { name: 'Urea (46% N)', nutrient: 'N', quantity: '25 kg/acre' },
      { name: 'DAP (18-46-0)', nutrient: 'P', quantity: '15 kg/acre' },
      { name: 'MOP (60% K)', nutrient: 'K', quantity: '10 kg/acre' },
    ],
    crops: [
      { name: 'Wheat', match: 92 },
      { name: 'Soybean', match: 85 },
      { name: 'Cotton', match: 78 },
    ],
    tips: [
      'Rotate crops to leguminous plants to fix nitrogen organically.',
      'Consider deep plowing to improve organic carbon mixing.',
      'Micro-irrigation recommended for current soil type.',
    ]
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Advisory</Text>
          <Text style={styles.subtitle}>Personalized recommendations for {farmerDetails.farmName || farmerDetails.name}&apos;s Farm</Text>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="leaf" size={24} color={theme.colors.warning} />
            <Text style={styles.statusCardTitle}>Soil Health: {mockData.status}</Text>
          </View>
          <Text style={styles.statusCardSubtitle}>Slightly deficient in Nitrogen. Good pH levels.</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardSectionTitle}>Fertilizer Plan</Text>
          {mockData.fertilizerPlan.map((item, idx) => (
            <View key={idx} style={styles.planItem}>
              <View>
                <Text style={styles.planName}>{item.name}</Text>
                <Text style={styles.planNutrient}>Targets: {item.nutrient}</Text>
              </View>
              <Text style={styles.planQty}>{item.quantity}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardSectionTitle}>Recommended Crops</Text>
          {mockData.crops.map((crop, idx) => (
            <View key={idx} style={styles.cropItem}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <View style={styles.cropMatchBox}>
                <Text style={styles.cropMatchText}>{crop.match}% Match</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardSectionTitle}>Farming Tips</Text>
          {mockData.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipItem}>
              <Ionicons name="medical-outline" size={16} color={theme.colors.accent} style={{ marginTop: 2 }} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Card>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Generate Full Report" 
          onPress={handleNext} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: theme.spacing.m, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: theme.spacing.m, fontSize: 16, color: theme.colors.textLight },
  header: { marginBottom: theme.spacing.l },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  statusCard: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusCardTitle: { fontSize: 18, fontWeight: 'bold', color: '#664d00', marginLeft: 8 },
  statusCardSubtitle: { fontSize: 14, color: '#997a00' },
  card: { marginBottom: theme.spacing.m },
  cardSectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.m },
  planItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  planName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  planNutrient: { fontSize: 12, color: theme.colors.textLight },
  planQty: { fontSize: 14, fontWeight: 'bold', color: theme.colors.accent },
  cropItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  cropName: { fontSize: 16, color: theme.colors.text },
  cropMatchBox: { backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  cropMatchText: { fontSize: 12, color: theme.colors.success, fontWeight: 'bold' },
  tipItem: { flexDirection: 'row', marginBottom: 12, paddingRight: 16 },
  tipText: { fontSize: 14, color: theme.colors.text, marginLeft: 8, lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.card, padding: theme.spacing.m, borderTopWidth: 1, borderTopColor: theme.colors.border }
});
