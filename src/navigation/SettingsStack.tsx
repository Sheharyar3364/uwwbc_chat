import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/Settings';
// import ProfileSettings from '../screens/settings/ProfileSettings';
// import AccountSettings from '../screens/settings/AccountSettings';
// import PrivacySettings from '../screens/settings/PrivacySettings';
// import NotificationSettings from '../screens/settings/NotificationSettings';
// import ChatSettings from '../screens/settings/ChatSettings';
// import StorageSettings from '../screens/settings/StorageSettings';
// import HelpSettings from '../screens/settings/HelpSettings';
// import AboutSettings from '../screens/settings/AboutSettings';

import ProfileSettings from '../screens/Settings/ProfileSettings';
import AccountSettings from '../screens/Settings/AccountSettings';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 34,
            fontWeight: '700',
          },
          headerSearchBarOptions: {
            placeholder: 'Search Settings',
            hideWhenScrolling: false,
          },
        }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{ title: 'Account' }}
      />
      {/* <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettings}
        options={{ title: 'Privacy' }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettings}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen
        name="StorageSettings"
        component={StorageSettings}
        options={{ title: 'Storage and Data' }}
      />
      <Stack.Screen
        name="HelpSettings"
        component={HelpSettings}
        options={{ title: 'Help' }}
      />
      <Stack.Screen
        name="AboutSettings"
        component={AboutSettings}
        options={{ title: 'About' }}
      /> */}
    </Stack.Navigator>
  );
}
