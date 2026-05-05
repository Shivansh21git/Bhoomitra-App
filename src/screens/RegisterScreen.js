import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import { apiService } from '../api/apiService';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !mobileNo) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Password and Confirm Password must match.');
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
      confirm_password: confirmPassword,
      mobile_no: mobileNo.trim(),
    };

    if (occupation.trim()) payload.occupation = occupation.trim();
    if (location.trim()) payload.location = location.trim();
    if (farmSize.trim()) {
      const parsedFarmSize = Number(farmSize);
      if (Number.isNaN(parsedFarmSize)) {
        Alert.alert('Validation', 'Farm size must be a valid number.');
        return;
      }
      payload.farm_size = parsedFarmSize;
    }

    setIsLoading(true);
    try {
      await apiService.register(payload);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
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
        <Text style={styles.welcomeTitle}>Create account</Text>
        <Text style={styles.welcomeSubtitle}>Register to get started</Text>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.colors.textLight}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number *"
            placeholderTextColor={theme.colors.textLight}
            value={mobileNo}
            onChangeText={setMobileNo}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="briefcase-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Occupation (Optional)"
            placeholderTextColor={theme.colors.textLight}
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Location (Optional)"
            placeholderTextColor={theme.colors.textLight}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="leaf-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Farm Size (Optional)"
            placeholderTextColor={theme.colors.textLight}
            value={farmSize}
            onChangeText={setFarmSize}
            keyboardType="numeric"
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

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.textLight}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.m }} />
        ) : (
          <Button
            title="Register"
            onPress={handleRegister}
            style={styles.registerBtn}
          />
        )}

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  formContent: {
    paddingBottom: theme.spacing.m,
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
  registerBtn: {
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
});
