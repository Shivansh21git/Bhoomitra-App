import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    if (userId.length > 0 && password.length > 0) {
      login('mock-jwt-token-12345');
    } else {
      Alert.alert('Validation', 'Please enter User ID and Password');
    }
  };

  const handleGoogleSignIn = async () => {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'demo-google-client-id';
    const redirectUri = 'https://auth.expo.io/@bhoomitra/app';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile`;
    try {
      await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    } catch (_error) {
      Alert.alert('Google Sign-In', 'Unable to launch Google OAuth flow.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/logo/bhoomitralogo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandTitle}>Bhoomitra</Text>
        <Text style={styles.brandSubtitle}>by AR RoboTics</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="User ID"
            placeholderTextColor={theme.colors.textLight}
            value={userId}
            onChangeText={setUserId}
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
          <Text style={styles.registerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} activeOpacity={0.85}>
          <View style={styles.googleIconWrap}>
            <Text style={styles.googleIcon}>G</Text>
          </View>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
  },
  logoImage: {
    width: 84,
    height: 84,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  },
  brandSubtitle: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 6,
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
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
    fontFamily: theme.typography.fontFamily,
  },
  registerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  googleBtn: {
    marginTop: theme.spacing.m,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  googleIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  googleIcon: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
  googleText: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
});
