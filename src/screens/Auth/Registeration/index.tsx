import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';
import welcomeImage from '@/assets/images/uwwbc_logo.png';

type RootStackParamList = {
  Home: undefined;
  OTP: undefined;
};

export default function Registeration() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function openLink() {
    Linking.openURL('https://www.uwwbcchat.com');
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <Image source={welcomeImage} style={styles.welcome} />
      <Text style={styles.headline}>Welcome to UWWBC Chat</Text>
      <Text style={styles.description}>
        Read Our{' '}
        <Text style={styles.link} onPress={openLink}>
          Privacy Policy
        </Text>
        . {' Tap "Agree & Continue" to accept '}
        <Text style={styles.link} onPress={openLink}>
          Terms of Service
        </Text>
        .
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('OTP')}
      >
        <Text style={styles.buttonText}>Agree & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    width: '100%',
    height: 300,
    marginBottom: 80,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  headline: {
    ...typography.h1,
  },
  description: {
    ...typography.body2,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 80,
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.h3,
    color: Colors.white,
  },
});
