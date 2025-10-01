import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {
  getAuthStatus,
  setAuthData,
  clearAuthData,
} from '../utils/authStorage';

import AppNavigator from './AppNavigator';
import LoadingScreen from '../screens/Loading';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check AsyncStorage first (faster)
        const storedAuthStatus = await getAuthStatus();

        // Check Firebase auth state (authoritative)
        const currentUser = auth().currentUser;

        if (currentUser && storedAuthStatus) {
          // Both Firebase and AsyncStorage confirm user is authenticated
          setIsAuthenticated(true);
        } else if (currentUser) {
          // Firebase has user but AsyncStorage doesn't - sync them
          await setAuthData(true, currentUser.phoneNumber || undefined);
          setIsAuthenticated(true);
        } else {
          // No authentication found
          await clearAuthData();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for Firebase auth state changes
    const unsubscribe = auth().onAuthStateChanged(async user => {
      console.log(
        'Auth state changed:',
        user ? `User: ${user.phoneNumber}` : 'No user',
      );

      if (user) {
        await setAuthData(true, user.phoneNumber || undefined);
        setIsAuthenticated(true);
      } else {
        await clearAuthData();
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoading || isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}
