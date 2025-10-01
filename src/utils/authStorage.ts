import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STATUS_KEY = 'user_authenticated';
const USER_PHONE_KEY = 'user_phone';

export const setAuthData = async (
  isAuthenticated: boolean,
  phoneNumber?: string,
) => {
  await AsyncStorage.setItem(AUTH_STATUS_KEY, JSON.stringify(isAuthenticated));
  if (phoneNumber) {
    await AsyncStorage.setItem(USER_PHONE_KEY, phoneNumber);
  }
};

export const getAuthStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(AUTH_STATUS_KEY);
    return value ? JSON.parse(value) : false;
  } catch {
    return false;
  }
};

export const getUserPhone = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_PHONE_KEY);
  } catch {
    return null;
  }
};

export const clearAuthData = async () => {
  await AsyncStorage.multiRemove([AUTH_STATUS_KEY, USER_PHONE_KEY]);
};
