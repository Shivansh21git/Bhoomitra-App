import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';

// Screens
import TestingListScreen from '../screens/testing/TestingListScreen';
import Step1DeviceScreen from '../screens/testing/Step1DeviceScreen';
import Step2FarmerDetailsScreen from '../screens/testing/Step2FarmerDetailsScreen';
import Step3SamplingScreen from '../screens/testing/Step3SamplingScreen';
import Step4SummaryScreen from '../screens/testing/Step4SummaryScreen';
import Step5AdvisoryScreen from '../screens/testing/Step5AdvisoryScreen';
import Step6ReportScreen from '../screens/testing/Step6ReportScreen';
import DeviceDataScreen from '../screens/testing/DeviceDataScreen';

const Stack = createNativeStackNavigator();

export default function TestingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TestingList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.lightGreen,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.softAccent,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontFamily: theme.typography.fontFamily,
        },
      }}
    >
      <Stack.Screen 
        name="TestingList" 
        component={TestingListScreen} 
        options={{ title: 'Soil Tests' }} 
      />
      <Stack.Screen name="Step1" component={Step1DeviceScreen} options={{ title: 'Step 1: Connect Device' }} />
      <Stack.Screen name="Step2" component={Step2FarmerDetailsScreen} options={{ title: 'Step 2: Farm Details' }} />
      <Stack.Screen name="Step3" component={Step3SamplingScreen} options={{ title: 'Step 3: Point Sampling' }} />
      <Stack.Screen name="Step4" component={Step4SummaryScreen} options={{ title: 'Step 4: Summary' }} />
      <Stack.Screen name="Step5" component={Step5AdvisoryScreen} options={{ title: 'Step 5: AI Advisory' }} />
      <Stack.Screen name="Step6" component={Step6ReportScreen} options={{ title: 'Step 6: Report' }} />
      <Stack.Screen name="DeviceData" component={DeviceDataScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
