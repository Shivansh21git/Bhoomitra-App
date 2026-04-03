import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';

export default function Step4SummaryScreen({ navigation }) {
  const { readings, clearReadings } = useTestStore();

  const calculateAverage = (key) => {
    if (readings.length === 0) return 0;
    const sum = readings.reduce((acc, curr) => acc + parseFloat(curr[key]), 0);
    return (sum / readings.length).toFixed(1);
  };

  const handleRetake = () => {
    clearReadings();
    navigation.goBack();
  };

  const handleSubmit = () => {
    navigation.navigate('Step5');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Data Summary</Text>
          <Text style={styles.subtitle}>Review your 5 point samples before AI analysis.</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Preliminary Averages</Text>
          
          <View style={styles.tableRowHeader}>
            <Text style={[styles.cell, { flex: 1.5 }]}>Param</Text>
            <Text style={styles.cell}>Avg</Text>
            <Text style={styles.cell}>Status</Text>
          </View>

          {[
            { key: 'pH', label: 'pH Level', threshold: 7.0 },
            { key: 'N', label: 'Nitrogen', threshold: 50 },
            { key: 'P', label: 'Phosphorus', threshold: 25 },
            { key: 'K', label: 'Potassium', threshold: 120 },
            { key: 'OC', label: 'Org Carbon', threshold: 0.6 },
          ].map((item, index) => {
            const avg = calculateAverage(item.key);
            const isGood = avg >= item.threshold;
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cellText, { flex: 1.5, fontWeight: '500' }]}>{item.label}</Text>
                <Text style={styles.cellText}>{avg}</Text>
                <Text style={[styles.cellText, { color: isGood ? theme.colors.success : theme.colors.warning }]}>
                  {isGood ? 'Optimal' : 'Marginal'}
                </Text>
              </View>
            );
          })}
        </Card>

        <Card style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Estimated Soil Health</Text>
          <Text style={styles.scoreValue}>78<Text style={styles.scoreSub}>/100</Text></Text>
          <Text style={styles.scoreFooter}>Ready for AI Processing.</Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Retake Readings" 
          variant="outline"
          onPress={handleRetake}
          style={styles.retakeBtn}
        />
        <Button 
          title="Submit to AI" 
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  summaryCard: {
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    color: theme.colors.primary,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  cell: {
    flex: 1,
    fontWeight: 'bold',
    color: theme.colors.textLight,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cellText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: '#f8fdf9',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  scoreTitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginVertical: theme.spacing.s,
  },
  scoreSub: {
    fontSize: 18,
    color: theme.colors.textLight,
  },
  scoreFooter: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  footer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
  },
  retakeBtn: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  submitBtn: {
    flex: 1,
    marginLeft: theme.spacing.s,
  }
});
