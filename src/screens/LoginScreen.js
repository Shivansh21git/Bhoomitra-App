import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    // Basic validation mock
    if (phoneNumber.length > 0 && password.length > 0) {
      // Mock JWT token
      login('mock-jwt-token-12345');
    } else {
      alert('Please enter Phone Number and Password');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconWrapper}>
          <Ionicons name="leaf" size={28} color={theme.colors.primary} />
        </View>
        <Text style={styles.brandTitle}>Bhoomitra</Text>
        <Text style={styles.brandSubtitle}>BY AGRIBID.AI</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button 
          title="Sign In" 
          onPress={handleLogin}
          style={styles.loginBtn}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC', // Very light background
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50', // Agribid green
    letterSpacing: 1.5,
    marginTop: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: theme.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  loginBtn: {
    marginTop: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  registerText: {
    color: theme.colors.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  }
});
