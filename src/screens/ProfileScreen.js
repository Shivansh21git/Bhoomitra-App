import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen() {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>V</Text>
        </View>
        <Text style={styles.name}>Nitika</Text>
        <Text style={styles.role}>Field Agent • Maharastra</Text>
      </View>

      <Card style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={20} color={theme.colors.textLight} />
          <Text style={styles.rowText}>+91 98765 43210</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textLight} />
          <Text style={styles.rowText}>nitika@bhoomitra.app</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Ionicons name="settings-outline" size={20} color={theme.colors.textLight} />
          <Text style={styles.rowText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} style={{marginLeft: 'auto'}} />
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.textLight} />
          <Text style={styles.rowText}>About Bhoomitra App</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} style={{marginLeft: 'auto'}} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.textLight} />
          <Text style={styles.rowText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} style={{marginLeft: 'auto'}} />
        </View>
      </Card>

      <Button title="Logout" variant="outline" onPress={handleLogout} style={styles.logoutBtn} />
      
      <Text style={styles.version}>App Version 1.0.0 (Build 42)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  header: { alignItems: 'center', marginVertical: theme.spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.m },
  initial: { fontSize: 32, fontWeight: 'bold', color: theme.colors.card },
  name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  role: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  section: { padding: 0, paddingVertical: theme.spacing.s, marginBottom: theme.spacing.l },
  row: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.m },
  rowText: { fontSize: 16, color: theme.colors.text, marginLeft: theme.spacing.m },
  divider: { height: 1, backgroundColor: theme.colors.border, marginLeft: 50 },
  logoutBtn: { marginTop: theme.spacing.m, borderColor: theme.colors.error },
  version: { textAlign: 'center', marginTop: theme.spacing.xl, color: theme.colors.textLight, fontSize: 12 }
});
