import React, { useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { defaultStyles } from '../constants/Styles';

export default function CountryPickerComponent({
  countryCode,
  setCountryCode,
  country,
  setCountry,
}: any) {
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);
  const [withFlag, setWithFlag] = useState<boolean>(true);
  const [withEmoji, setWithEmoji] = useState<boolean>(true);
  const [withFilter, setWithFilter] = useState<boolean>(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false);
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
  };

  const [phoneNumber, setPhoneNumber] = useState();

  const keyboardVerticalOffset = Platform.OS == 'ios' ? 90 : 0;

  function openLink() {
    Linking.openURL('www.uwwbcchat.com');
  }

  console.log('country', country);

  return (
    <View style={styles.container}>
      <View style={styles.listItem}>
        <CountryPicker
          {...{
            countryCode,
            withFilter,
            withFlag,
            withCountryNameButton,
            withAlphaFilter,
            withCallingCode,
            withEmoji,
            onSelect,
          }}
          visible
        />
        <Text>
          {typeof country?.name === 'string'
            ? country.name
            : country?.name?.common ?? 'Unknown'}
        </Text>
      </View>
      <View style={defaultStyles.separator}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //  g: 20,
  },
  instructions: {},
  welcome: {},
  data: {},
  listItem: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
});
