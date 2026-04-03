import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTestStore } from '../../store/useTestStore';

export default function Step2FarmerDetailsScreen({ navigation }) {
  const { farmerDetails, updateFarmerDetails } = useTestStore();
  
  // Local state for the form
  const [form, setForm] = useState(farmerDetails);

  const handleNext = () => {
    // Basic validation
    if (!form.name || !form.mobile) {
      alert('Please fill in required fields (Name and Mobile).');
      return;
    }
    updateFarmerDetails(form);
    navigation.navigate('Step3');
  };

  const handleSaveDraft = () => {
    updateFarmerDetails(form);
    alert('Draft saved locally.');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Farmer & Farm Details</Text>
          <Text style={styles.subtitle}>Enter the basic details for the soil test report.</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.sectionLabel}>Farmer Information</Text>
          
          <Text style={styles.label}>Farmer Name *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Ramesh Singh"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
          />
          
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={form.mobile}
            onChangeText={(text) => setForm({...form, mobile: text})}
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionLabel}>Farm Information</Text>
          
          <Text style={styles.label}>Farm Name (Optional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. North Side Plot"
            value={form.farmName}
            onChangeText={(text) => setForm({...form, farmName: text})}
          />
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: theme.spacing.s }]}>
              <Text style={styles.label}>Farm Size *</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 5"
                keyboardType="numeric"
                value={form.farmSize}
                onChangeText={(text) => setForm({...form, farmSize: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Unit</Text>
              <TextInput 
                style={styles.input} 
                value={form.unit}
                onChangeText={(text) => setForm({...form, unit: text})}
              />
            </View>
          </View>

          <Text style={styles.label}>Soil Type</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Loamy, Clay, Sandy"
            value={form.soilType}
            onChangeText={(text) => setForm({...form, soilType: text})}
          />
        </Card>
        
        <Card style={styles.formCard}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.label}>Pin Code</Text>
          <TextInput 
            style={styles.input} 
            placeholder="6-digit pin"
            keyboardType="numeric"
            maxLength={6}
            value={form.pinCode}
            onChangeText={(text) => setForm({...form, pinCode: text})}
          />
          <Text style={styles.label}>District</Text>
          <TextInput 
            style={styles.input} 
            placeholder="District"
            value={form.district}
            onChangeText={(text) => setForm({...form, district: text})}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Save Draft" 
          variant="outline"
          onPress={handleSaveDraft}
          style={styles.draftBtn}
        />
        <Button 
          title="Next Step" 
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.m,
    paddingBottom: 100, // padding for footer
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
  formCard: {
    marginBottom: theme.spacing.m,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: theme.spacing.s,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.s,
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
    backgroundColor: '#fafafa',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-between',
  },
  draftBtn: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  nextBtn: {
    flex: 1,
    marginLeft: theme.spacing.s,
  }
});
