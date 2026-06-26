import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, ActivityIndicator, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../api/apiService';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
  const logout = useAuthStore(state => state.logout);
  const userToken = useAuthStore(state => state.userToken);

  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Add Device Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceLocation, setNewDeviceLocation] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('basic');
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  const userName = username || 'User';

  const hydrateForm = useCallback((data) => {
    const apiUser = data?.user || {};
    const apiProfile = data?.profile || {};

    setUsername(apiUser.username || '');
    setEmail(apiUser.email || '');
    setMobileNo(apiProfile.mobile_no || '');
    setOccupation(apiProfile.occupation || '');
    setLocation(apiProfile.location || '');
    setFarmSize(apiProfile.farm_size !== undefined && apiProfile.farm_size !== null ? String(apiProfile.farm_size) : '');
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getProfile(userToken);
      setProfileData(data);
      hydrateForm(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, [hydrateForm, userToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const changedFields = useMemo(() => {
    const original = profileData?.profile || {};
    const next = {
      mobile_no: mobileNo,
      occupation,
      location,
      farm_size: farmSize === '' ? null : Number(farmSize),
    };

    return Object.entries(next).reduce((acc, [key, value]) => {
      const prev = original[key] ?? null;
      const normalizedValue = Number.isNaN(value) ? null : value;
      if (prev !== normalizedValue) {
        acc[key] = normalizedValue;
      }
      return acc;
    }, {});
  }, [farmSize, location, mobileNo, occupation, profileData]);

  const handleAddDevice = async () => {
    if (!userToken) {
      return;
    }

    if (!newDeviceId.trim()) {
      Alert.alert('Validation Error', 'Device ID is required.');
      return;
    }

    if (!newDeviceName.trim()) {
      Alert.alert('Validation Error', 'Device Name is required.');
      return;
    }

    setIsAddingDevice(true);
    try {
      const payload = {
        device_id: newDeviceId.trim(),
        name: newDeviceName.trim(),
        location: newDeviceLocation.trim(),
        device_type: newDeviceType,
      };

      await apiService.addDevice(userToken, payload);

      Alert.alert('Success', 'Device added successfully.');
      setIsAddModalVisible(false);
      
      // Reset form fields
      setNewDeviceId('');
      setNewDeviceName('');
      setNewDeviceLocation('');
      setNewDeviceType('basic');
    } catch (err) {
      Alert.alert('Failed to Add Device', err.message || 'Failed to add device.');
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" }
    ]);
  };

  const handleSave = async () => {
    if (!userToken) {
      return;
    }

    if (Object.keys(changedFields).length === 0) {
      Alert.alert('No Changes', 'There is nothing to update.');
      return;
    }

    setIsSaving(true);
    try {
      await apiService.updateProfile(userToken, changedFields);
      await fetchProfile();
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>Profile Information</Text>
      </View>

      <Card style={styles.section}>
        {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.m }} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.row}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <Text style={styles.valueText}>{username || '-'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <Text style={styles.valueText}>{email || '-'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="call-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="briefcase-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="Enter occupation"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="leaf-outline" size={20} color={theme.colors.textLight} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Farm Size</Text>
            <TextInput
              style={styles.input}
              value={farmSize}
              onChangeText={setFarmSize}
              placeholder="Enter farm size"
              keyboardType="numeric"
            />
          </View>
        </View>
      </Card>

      <Button
        title={isSaving ? 'Saving...' : 'Save Profile'}
        onPress={handleSave}
        disabled={isSaving || isLoading}
        style={styles.saveBtn}
      />

      <Button
        title="+ Add New Device"
        onPress={() => setIsAddModalVisible(true)}
        variant="primary"
        style={styles.addDeviceBtn}
      />

      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />

      <Text style={styles.version}>App Version 1.0.0 (Build 42)</Text>

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Device</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalFormGroup}>
                <Text style={styles.modalFormLabel}>Device ID (Unique)*</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newDeviceId}
                  onChangeText={setNewDeviceId}
                  placeholder="e.g. ESP32-SOIL-01"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalFormLabel}>Device Name*</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newDeviceName}
                  onChangeText={setNewDeviceName}
                  placeholder="e.g. Front Garden"
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalFormLabel}>Location (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newDeviceLocation}
                  onChangeText={setNewDeviceLocation}
                  placeholder="e.g. Farm A"
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalFormLabel}>Device Type</Text>
                <View style={styles.modalPickerWrapper}>
                  <Picker
                    selectedValue={newDeviceType}
                    onValueChange={(val) => setNewDeviceType(val)}
                    style={styles.modalPicker}
                  >
                    <Picker.Item label="Basic (NPK + Temp + Humid)" value="basic" />
                    <Picker.Item label="Advanced (NPK + EC + pH + Moist + Temp + Humid)" value="advanced" />
                  </Picker>
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title={isAddingDevice ? "Adding..." : "Add Device"}
                  onPress={handleAddDevice}
                  disabled={isAddingDevice}
                  style={styles.modalBtnSubmit}
                />
                <TouchableOpacity
                  onPress={() => setIsAddModalVisible(false)}
                  style={styles.modalBtnCancel}
                  disabled={isAddingDevice}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m
  },

  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.m
  },

  initial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.card
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text
  },

  role: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4
  },

  section: {
    padding: 0,
    paddingVertical: theme.spacing.s,
    marginBottom: theme.spacing.l
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m
  },

  rowText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.m
  },
  inputGroup: {
    marginLeft: theme.spacing.m,
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: '#fff',
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 50
  },

  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginVertical: theme.spacing.s,
  },

  saveBtn: {
    marginBottom: theme.spacing.s,
  },

  logoutBtn: {
    borderColor: theme.colors.error
  },

  version: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    color: theme.colors.textLight,
    fontSize: 12
  },

  addDeviceBtn: {
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.card || '#fff',
    borderRadius: theme.borderRadius.m || 10,
    padding: theme.spacing.l || 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  modalFormGroup: {
    marginBottom: theme.spacing.m,
  },
  modalFormLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
    fontFamily: theme.typography.fontFamily,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: '#fff',
    fontFamily: theme.typography.fontFamily,
  },
  modalPickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  modalPicker: {
    height: 50,
    width: '100%',
    color: theme.colors.text,
  },
  modalActions: {
    marginTop: theme.spacing.l,
    gap: 8,
  },
  modalBtnSubmit: {
    marginBottom: 0,
  },
  modalBtnCancel: {
    alignSelf: 'center',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    color: theme.colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
});