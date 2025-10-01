import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskInput from 'react-native-mask-input';
import auth from '@react-native-firebase/auth';
import CountryPicker from '@/src/components/CountryPicker';
import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';
import { setAuthData } from '@/src/utils/authStorage';

export default function OTP() {
  const [countryCode, setCountryCode] = useState('BE');
  const [country, setCountry] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { bottom } = useSafeAreaInsets();

  const sendOTP = async () => {
    if (!phoneNumber || !country?.callingCode?.[0]) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `+${country.callingCode[0]}${phoneNumber}`;
      console.log('Sending OTP to:', fullPhoneNumber);

      // Use React Native Firebase auth correctly
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

      console.log('Confirmation Result:', confirmation);
      setConfirmationResult(confirmation);
      setLoading(false);

      Alert.alert(
        'Success',
        `OTP sent to ${fullPhoneNumber}\n\nIf you're testing, use code 123456 for test numbers.`,
      );
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Failed to send OTP';

      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'CAPTCHA verification failed. Please try again.';
      }

      Alert.alert('Error', error.message || errorMessage);
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    console.log('verifying OTP');
    if (!confirmationResult) {
      Alert.alert('Error', 'No OTP request found. Please request again.');
      return;
    }

    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await confirmationResult.confirm(otpCode);
      const phoneNumber = userCredential.user.phoneNumber;
      await setAuthData(true, phoneNumber || undefined);
      setLoading(false);

      console.log('User signed in:', userCredential.user);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setLoading(false);

      if (error.code === 'auth/invalid-verification-code') {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      } else {
        Alert.alert('Error', error.message || 'Failed to verify OTP');
      }
    }
  };

  const callingCode = country?.callingCode?.[0] ?? '';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ ...typography.body1, marginTop: 10 }}>
            {confirmationResult ? 'Verifying...' : 'Sending OTP...'}
          </Text>
        </View>
      )}
      <View style={styles.container}>
        {!confirmationResult ? (
          <>
            <Text style={styles.description}>
              Enter your phone number to receive an OTP.
            </Text>
            <View style={styles.list}>
              <CountryPicker
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                country={country}
                setCountry={setCountry}
              />
              <View style={styles.phoneRow}>
                <Text style={styles.dialCode}>+{callingCode}</Text>
                <MaskInput
                  value={phoneNumber}
                  style={styles.input}
                  onChangeText={(masked, unmasked) => setPhoneNumber(unmasked)}
                  mask={[
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  keyboardType="numeric"
                  placeholder="Phone number"
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                phoneNumber.length >= 8 ? styles.enabled : null,
                { marginBottom: bottom },
              ]}
              onPress={sendOTP}
              disabled={loading || phoneNumber.length < 8}
            >
              <Text
                style={[
                  typography.h3,
                  phoneNumber.length >= 8 ? styles.enabledText : null,
                ]}
              >
                Send OTP
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Enter the 6-digit OTP sent to your phone:
            </Text>
            <TextInput
              value={otpCode}
              onChangeText={setOtpCode}
              style={[styles.input, styles.otpInput]}
              placeholder="000000"
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              textAlign="center"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  otpCode.length === 6 ? styles.enabled : null,
                ]}
                onPress={verifyOTP}
                disabled={loading || otpCode.length !== 6}
              >
                <Text
                  style={[
                    typography.h3,
                    otpCode.length === 6 ? styles.enabledText : null,
                  ]}
                >
                  Verify OTP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  { marginTop: 10 },
                ]}
                onPress={() => {
                  setConfirmationResult(null);
                  setOtpCode('');
                }}
              >
                <Text style={[typography.h3, { color: Colors.primary }]}>
                  Change Phone Number
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: Colors.background,
  },
  description: {
    ...typography.messageText,
    textAlign: 'center',
  },
  list: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  enabledText: {
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: 10,
    ...typography.h3,
    borderRadius: 8,
    marginTop: 10,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialCode: {
    ...typography.h3,
    marginRight: 8,
    color: Colors.black,
    paddingTop: 5,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
});
