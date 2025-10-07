import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import MainTabNavigator from './MainTabNavigator'; // New tab navigator
import OTPScreen from '../screens/Auth/Otp';
import Registeration from '../screens/Auth/Registeration';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  isAuthenticated: boolean;
}

export default function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Authenticated - Show tabs
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          {/* Stack screens that should be above tabs (like individual chat screen) */}
          {/* <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
        </>
      ) : (
        // Not authenticated - Auth flow
        <>
          <Stack.Screen name="Registeration" component={Registeration} />
          <Stack.Screen
            name="OTP"
            component={OTPScreen}
            options={{ headerShown: true, title: 'Enter Your Phone Number' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
