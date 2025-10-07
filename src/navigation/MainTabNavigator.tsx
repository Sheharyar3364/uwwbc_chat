import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, View, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import BusinessScreen from '../screens/Business';
import ChatsScreen from '../screens/Chats';
import UpdatesScreen from '../screens/Updates';
import CallsScreen from '../screens/Calls';
import CatalogueScreen from '../screens/Catalogue';

import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

// Glass Morphism Background
const GlassyBackground = () => (
  <View style={styles.backgroundContainer}>
    <View style={styles.glassBase} />
    <View style={styles.gradientOverlay} />
    <View style={styles.frostLayer} />
    <View style={styles.borderHighlight} />
  </View>
);

// Animated Tab Icon Component with Glossy White Selection
const AnimatedTabIcon = ({ focused, color, iconName, size }) => {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.85),
  ).current;
  const opacityValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.7),
  ).current;
  const translateY = React.useRef(new Animated.Value(focused ? -1 : 0)).current;
  const glowOpacity = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1 : 0.85,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      Animated.timing(glowOpacity, {
        toValue: focused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [{ scale: scaleValue }, { translateY: translateY }],
          opacity: opacityValue,
        },
      ]}
    >
      {/* Glossy White Background for Active State */}
      {focused && (
        <Animated.View
          style={[styles.glossyWhiteBackground, { opacity: glowOpacity }]}
        />
      )}

      <View
        style={[styles.iconBackground, focused && styles.activeIconBackground]}
      >
        <Ionicons
          name={iconName}
          size={size}
          color={focused ? '#00D4AA' : color}
          style={[styles.iconStyle, focused && styles.activeIconStyle]}
        />
      </View>
    </Animated.View>
  );
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;
          let size = focused ? 26 : 22;

          switch (route.name) {
            case 'Business':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'Chats':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Updates':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'Calls':
              iconName = focused ? 'call' : 'call-outline';
              break;
            case 'Catalogue':
              iconName = focused ? 'albums' : 'albums-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              iconName={iconName}
              size={size}
            />
          );
        },
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: 'rgba(60, 60, 67, 0.6)',
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            height: 85 + Math.max(insets.bottom, 8), // Increased height for full labels
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
        tabBarBackground: GlassyBackground,
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false, // Prevents label truncation
      })}
      initialRouteName="Settings"
    >
      <Tab.Screen
        name="Updates"
        component={UpdatesScreen}
        options={{ tabBarLabel: 'Updates' }}
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
          headerShown: true,
          headerTitle: 'Chats',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Floating Tab Bar Design
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 12, // Reduced margin for more space
    right: 12,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingTop: 12,
    paddingHorizontal: 4, // Reduced horizontal padding
    borderRadius: 24,

    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 30,
  },

  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
  },

  glassBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.85)',
      android: 'rgba(255, 255, 255, 0.9)',
    }),
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 212, 170, 0.05)',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },

  frostLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.select({
      ios: 'rgba(248, 250, 252, 0.6)',
      android: 'rgba(248, 250, 252, 0.7)',
    }),
    shadowColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  borderHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    shadowColor: 'rgba(0, 212, 170, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },

  // Enhanced Icon Container
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    position: 'relative',
  },

  // Glossy White Background for Active State
  glossyWhiteBackground: {
    position: 'absolute',
    width: 56,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',

    // Multiple shadow layers for glossy effect
    shadowColor: 'rgba(255, 255, 255, 0.8)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,

    // Inner highlight
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',

    // Glossy shine effect
    overflow: 'hidden',
  },

  // Icon Background
  iconBackground: {
    width: 52,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },

  activeIconBackground: {
    backgroundColor: 'transparent', // Let glossy white show through
  },

  // Enhanced Icon Styling
  iconStyle: {
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  activeIconStyle: {
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Full Label Styling - No Truncation
  tabBarLabel: {
    fontSize: 10, // Slightly smaller to fit all text
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
    lineHeight: 12,

    // Ensure full text is visible
    numberOfLines: 1,
    adjustsFontSizeToFit: false,

    textShadowColor: 'rgba(255, 255, 255, 0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Optimized Tab Item Spacing
  tabBarItem: {
    paddingVertical: 8,
    paddingHorizontal: 2, // Minimal horizontal padding
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Enhanced Badge Design
  tabBarBadge: {
    backgroundColor: '#FF3B5C',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    marginTop: -8,
    marginLeft: 14,

    borderWidth: 2.5,
    borderColor: '#FFFFFF',

    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 15,
  },
});
