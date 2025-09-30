import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';
import CountryPicker from '@/src/components/CountryPicker';

import { useEffect, useState } from 'react';
import {
  Country,
  CountryCode,
  FlagType,
  getAllCountries,
} from 'react-native-country-picker-modal';

// import { auth } from "../config/firebase";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OTP() {
  const [countryCode, setCountryCode] = useState<CountryCode>('BE');
  const [country, setCountry] = useState<Country | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDefaultCountry = async () => {
      const flagType: FlagType = FlagType.FLAT;
      const allCountries = await getAllCountries(flagType);

      const defaultCountry = allCountries.find(c => c.cca2 === 'BE') ?? null;
      if (defaultCountry) {
        setCountry(defaultCountry);
        setCountryCode(defaultCountry.cca2);
      }
    };

    loadDefaultCountry();
  }, []);

  const sendOTP = async () => {
    // if (!phoneNumber || !country?.callingCode?.[0]) {
    //   alert("Please enter a valid phone number");
    //   return;
    // }

    setLoading(true);

    // try {
    //   const fullPhoneNumber = `+${country.callingCode[0]}${phoneNumber}`;
    //   const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

    //   setConfirmationResult(confirmation);
    //   setLoading(false);

    //   alert(`OTP sent to ${fullPhoneNumber}`);
    // } catch (error: any) {
    //   console.error("Error sending OTP:", error);
    //   alert(error.message);
    //   setLoading(false);
    // }
  };

  const trySignIn = async () => {};

  const { bottom } = useSafeAreaInsets();

  const callingCode = country?.callingCode?.[0] ?? '';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ ...typography.body1, marginTop: 10 }}>
            Sending Code
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <Text style={styles.description}>
          UWWBC Chat will need to verify your account. Carrier charges may
          apply.
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
              onChangeText={(masked, unmasked) => {
                setPhoneNumber(unmasked); // you can also store unmasked if you want raw digits
              }}
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
              autoFocus
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.legal}>
          You must be <Text style={styles.link}>at least 16 years old</Text> to
          register. Learn how
          <Text style={styles.link}> UWWBC Chat </Text>works.
        </Text>{' '}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            phoneNumber !== '' ? styles.enabled : null,
            ,
            { marginBottom: bottom },
          ]}
          onPress={sendOTP}
        >
          <Text
            style={[typography.h3, phoneNumber !== '' ? styles.enabled : null]}
          >
            Next
          </Text>
        </TouchableOpacity>
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
  },
  list: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  legal: {
    ...typography.body1,
    textAlign: 'center',
    color: Colors.black,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: 6,
    ...typography.h3,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    // paddingHorizontal: 10,
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
});
