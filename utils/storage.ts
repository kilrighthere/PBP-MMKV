import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

// Storage keys
export const STORAGE_KEYS = {
  USER_EMAIL: 'user_email',
  USER_ID: 'user_id',
  IS_LOGGED_IN: 'is_logged_in',
  USER_NAME: 'user_name',
} as const;

// Helper functions for user data
export const saveUserData = (userId: string, email: string, userName?: string) => {
  storage.set(STORAGE_KEYS.USER_ID, userId);
  storage.set(STORAGE_KEYS.USER_EMAIL, email);
  storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
  if (userName) {
    storage.set(STORAGE_KEYS.USER_NAME, userName);
  }
  console.log('✅ User data saved to MMKV:', { userId, email });
};

export const clearUserData = () => {
  storage.remove(STORAGE_KEYS.USER_ID);
  storage.remove(STORAGE_KEYS.USER_EMAIL);
  storage.remove(STORAGE_KEYS.IS_LOGGED_IN);
  storage.remove(STORAGE_KEYS.USER_NAME);
  console.log('🗑️ User data cleared from MMKV');
};

export const getUserData = () => {
  const userData = {
    userId: storage.getString(STORAGE_KEYS.USER_ID),
    email: storage.getString(STORAGE_KEYS.USER_EMAIL),
    userName: storage.getString(STORAGE_KEYS.USER_NAME),
    isLoggedIn: storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false,
  };
  console.log('📖 Reading user data from MMKV:', userData);
  return userData;
};

export const isUserLoggedIn = (): boolean => {
  return storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false;
};

// Generic storage functions
export const setItem = (key: string, value: string | number | boolean) => {
  if (typeof value === 'string') {
    storage.set(key, value);
  } else if (typeof value === 'number') {
    storage.set(key, value);
  } else if (typeof value === 'boolean') {
    storage.set(key, value);
  }
};

export const getItem = (key: string): string | number | boolean | undefined => {
  return storage.getString(key) || storage.getNumber(key) || storage.getBoolean(key);
};

export const removeItem = (key: string) => {
  storage.remove(key);
};

export const clearAll = () => {
  storage.clearAll();
  console.log('🗑️ All MMKV storage cleared');
};
