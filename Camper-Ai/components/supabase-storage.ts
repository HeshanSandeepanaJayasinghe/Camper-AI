import { Platform } from 'react-native';

type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

/** Avoids touching AsyncStorage/localStorage during Expo web SSR (no `window`). */
export const supabaseStorage: AuthStorage = {
  getItem: async (key) => {
    if (!isBrowser()) return null;

    if (Platform.OS === 'web') {
      return window.localStorage.getItem(key);
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (!isBrowser()) return;

    if (Platform.OS === 'web') {
      window.localStorage.setItem(key, value);
      return;
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (!isBrowser()) return;

    if (Platform.OS === 'web') {
      window.localStorage.removeItem(key);
      return;
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem(key);
  },
};
