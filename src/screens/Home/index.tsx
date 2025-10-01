import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { clearAuthData, getUserPhone } from '@/src/utils/authStorage';
import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';

export default function HomeScreen() {
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadUserData = async () => {
      const phone = await getUserPhone();
      setPhoneNumber(phone);
    };
    loadUserData();
  }, []);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
            await clearAuthData();
            // App.tsx will detect auth state change and navigate
          } catch (error) {
            console.error('Error signing out:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Business App! 🎉</Text>
      {phoneNumber && <Text style={styles.subtitle}>Phone: {phoneNumber}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>My Business</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Catalogue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={[styles.buttonText, styles.signOutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body1,
    marginBottom: 40,
    color: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.h3,
    color: Colors.white,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 20,
  },
  signOutText: {
    color: Colors.primary,
  },
});
