import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, View } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import Colors from '../constants/Colors';
import { typography } from '../constants/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import BusinessScreen from '../screens/Business';
import ChatsScreen from '../screens/Chats';
import UpdatesScreen from '../screens/Updates';
import CallsScreen from '../screens/Calls';
import CatalogueScreen from '../screens/Catalogue';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();

// PREMIUM GLASSY BACKGROUND - ATTACHED TO BOTTOM
const GlassyBackground = () => <View style={styles.glassyBackground} />;

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Business':
              iconName = focused ? 'storefront' : 'store';
              break;
            case 'Chats':
              iconName = focused ? 'forum' : 'chat-bubble-outline';
              break;
            case 'Updates':
              iconName = focused ? 'auto-awesome' : 'radio-button-unchecked';
              break;
            case 'Calls':
              iconName = focused ? 'call' : 'call';
              break;
            case 'Catalogue':
              iconName = focused ? 'inventory' : 'inventory-2';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings'; // FIXED: Same icon for both states
              break;
            default:
              iconName = 'home';
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Icon
                name={iconName}
                size={focused ? 26 : 24} // REDUCED SIZE
                color={color}
                style={[styles.iconStyle, focused && styles.activeIconStyle]}
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: 'rgba(60, 60, 67, 0.6)',
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: insets.bottom, // ONLY safe area, no extra padding
            height: 65 + insets.bottom, // REDUCED HEIGHT
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
        tabBarBackground: GlassyBackground,
        tabBarShowLabel: true,
      })}
      initialRouteName="Chats"
    >
      <Tab.Screen
        name="Updates"
        component={UpdatesScreen}
        options={{ tabBarLabel: 'Updates' }} // EXPLICIT LABELS
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{ tabBarLabel: 'Calls' }}
      />
      <Tab.Screen
        name="Catalogue"
        component={CatalogueScreen}
        options={{ tabBarLabel: 'Catalogue' }}
      />
      <Tab.Screen
        name="Business"
        component={BusinessScreen}
        options={{ tabBarLabel: 'Business' }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarBadge: 3,
          tabBarBadgeStyle: styles.tabBarBadge,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // ATTACHED TO BOTTOM - NO FLOATING
  tabBar: {
    position: 'absolute',
    bottom: 0, // ATTACHED TO BOTTOM
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingTop: 8, // REDUCED PADDING
    paddingHorizontal: 0,

    // PREMIUM SHADOW
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: -4, // REDUCED SHADOW
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 20,

    borderWidth: 0, // REMOVED BORDER
  },

  // GLASSY BACKGROUND - ATTACHED
  glassyBackground: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.85)', // MORE OPAQUE
      android: 'rgba(255, 255, 255, 0.92)',
    }),

    shadowColor: 'rgba(0, 212, 170, 0.05)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 15,

    // SUBTLE TOP BORDER ONLY
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
  },

  // COMPACT ICON CONTAINER
  iconContainer: {
    width: 40, // REDUCED WIDTH
    height: 32, // REDUCED HEIGHT
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1, // MINIMAL MARGIN
  },

  activeIconContainer: {
    backgroundColor: 'rgba(0, 212, 170, 0.12)',
    transform: [{ scale: 1.02 }], // SUBTLE SCALE

    shadowColor: 'rgba(0, 212, 170, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  iconStyle: {
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },

  activeIconStyle: {
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // COMPACT LABELS - FULL TEXT VISIBLE
  tabBarLabel: {
    fontSize: 10, // SMALLER FONT
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 2, // REDUCED MARGIN
    marginBottom: 1,
    textAlign: 'center',

    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },

  // COMPACT TAB ITEMS
  tabBarItem: {
    paddingVertical: 4, // REDUCED PADDING
    paddingHorizontal: 2,
    flex: 1, // EQUAL WIDTH FOR ALL TABS
  },

  // COMPACT BADGE
  tabBarBadge: {
    backgroundColor: '#FF3B5C',
    color: '#FFFFFF',
    fontSize: 10, // SMALLER FONT
    fontWeight: '800',
    minWidth: 18, // SMALLER SIZE
    height: 18,
    borderRadius: 9,
    marginTop: -4, // BETTER POSITIONING
    marginLeft: 8,

    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',

    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
});
