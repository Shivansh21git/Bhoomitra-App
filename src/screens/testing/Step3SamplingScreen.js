import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';
import { Ionicons } from '@expo/vector-icons';

export default function Step3SamplingScreen({ navigation }) {
  const { readings, addReading } = useTestStore();
  const [liveData, setLiveData] = useState({
    pH: 7.0, N: 45, P: 20, K: 150, OC: 0.5, EC: 1.2
  });

  // Simulate 1Hz data updates from BLE
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        pH: (6.5 + Math.random()).toFixed(1),
        N: Math.floor(40 + Math.random() * 20),
        P: Math.floor(15 + Math.random() * 10),
        K: Math.floor(130 + Math.random() * 40),
        OC: (0.4 + Math.random() * 0.3).toFixed(2),
        EC: (1.0 + Math.random() * 0.5).toFixed(2),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = () => {
    if (readings.length >= 5) {
      Alert.alert("Maximum Readings", "You have already captured 5 readings.");
      return;
    }
    addReading({ id: Date.now().toString(), ...liveData, timestamp: new Date().toLocaleTimeString() });
  };

  const handleNext = () => {
    if (readings.length < 5) {
      Alert.alert("Incomplete", "Please capture all 5 point samples.");
      return;
    }
    navigation.navigate('Step4');
  };

  const renderReadingItem = (item, index) => (
    <View key={item.id} style={styles.readingItem}>
      <View style={styles.readingHeader}>
        <Text style={styles.readingTitle}>Point {index + 1}</Text>
        <Text style={styles.readingTime}>{item.timestamp}</Text>
      </View>
      <View style={styles.readingData}>
        <Text style={styles.dataText}>pH: {item.pH}</Text>
        <Text style={styles.dataText}>N: {item.N}</Text>
        <Text style={styles.dataText}>P: {item.P}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Point Sampling</Text>
          <Text style={styles.subtitle}>Capture exactly 5 point readings across the farm.</Text>
        </View>

        <Card style={styles.liveCard}>
          <View style={styles.liveHeader}>
            <Ionicons name="radio-outline" size={24} color={theme.colors.success} />
            <Text style={styles.liveTitle}>Live Sensor Data</Text>
          </View>
          
          <View style={styles.grid}>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.pH}</Text><Text style={styles.lbl}>pH</Text></View>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.N}</Text><Text style={styles.lbl}>Nitrogen</Text></View>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.P}</Text><Text style={styles.lbl}>Phosphorus</Text></View>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.K}</Text><Text style={styles.lbl}>Potassium</Text></View>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.OC}%</Text><Text style={styles.lbl}>Org Carbon</Text></View>
            <View style={styles.gridBox}><Text style={styles.val}>{liveData.EC}</Text><Text style={styles.lbl}>EC (ms/cm)</Text></View>
          </View>

          <Button 
            title={`Capture Reading (${readings.length}/5)`} 
            onPress={handleCapture}
            style={[styles.captureBtn, readings.length >= 5 && { backgroundColor: theme.colors.textLight }]}
          />
        </Card>

        <Text style={styles.sectionTitle}>Captured Samples</Text>
        {readings.length === 0 ? (
          <Text style={styles.emptyText}>No readings captured yet.</Text>
        ) : (
          readings.map((r, i) => renderReadingItem(r, i))
        )}
        <View style={{height: 100}} />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Review Summary & Next" 
          onPress={handleNext}
          style={{ opacity: readings.length === 5 ? 1 : 0.5 }}
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
  header: {
    padding: theme.spacing.m,
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
  liveCard: {
    margin: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  liveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.s,
    color: theme.colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  gridBox: {
    width: '31%',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.borderRadius.s,
    marginBottom: theme.spacing.s,
  },
  val: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  lbl: {
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  captureBtn: {
    backgroundColor: theme.colors.accent,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  emptyText: {
    marginHorizontal: theme.spacing.m,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  readingItem: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  readingTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  readingTime: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  readingData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataText: {
    fontSize: 13,
    color: theme.colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});
