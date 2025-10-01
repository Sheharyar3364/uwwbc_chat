import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import OTP from '../screens/Auth/Otp';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  isAuthenticated: boolean;
}

export default function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Authenticated screens
        <>
          <Stack.Screen name="Home" component={Home} />
          {/* Add other authenticated screens here */}
        </>
      ) : (
        // Authentication screens
        <>
          <Stack.Screen name="OTP" component={OTP} />
          {/* Add other auth screens here */}
        </>
      )}
    </Stack.Navigator>
  );
}
