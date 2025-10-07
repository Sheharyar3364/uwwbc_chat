import { Platform, TextStyle } from 'react-native';

const baseFont = Platform.select({
  ios: 'SF Pro Text',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Headers
  h1: {
    fontFamily: baseFont,
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  } as TextStyle,

  h2: {
    fontFamily: baseFont,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  } as TextStyle,

  h3: {
    fontFamily: baseFont,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  } as TextStyle,

  // Body text
  bodyBold: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  } as TextStyle,

  body1: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  } as TextStyle,

  body2: {
    fontFamily: baseFont,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  } as TextStyle,

  // Chat specific
  messageText: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 20,
  } as TextStyle,

  messageTime: {
    fontFamily: baseFont,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  } as TextStyle,

  senderName: {
    fontFamily: baseFont,
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  } as TextStyle,

  // UI Elements
  button: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 20,
  } as TextStyle,

  caption: {
    fontFamily: baseFont,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  } as TextStyle,

  // Tab bar text
  tabLabel: {
    fontFamily: baseFont,
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 12,
  } as TextStyle,
};

// Color palette for consistency
export const colors = {
  primary: '#007AFF', // iOS blue
  background: '#FFFFFF',
  surface: '#F2F2F7', // iOS light gray
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
  },
  message: {
    sent: '#007AFF',
    received: '#E9E9EB',
    text: '#FFFFFF',
  },
};
