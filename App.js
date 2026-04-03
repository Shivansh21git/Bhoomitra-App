import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    // Gives store time to rehydrate from AsyncStorage
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <LoginScreen />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
