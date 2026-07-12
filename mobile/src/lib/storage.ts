import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'eduspark_access_token';
const REFRESH_KEY = 'eduspark_refresh_token';

export const storage = {
  async getToken() {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.error('Error saving token', e);
    }
  },

  async removeToken() {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Error removing token', e);
    }
  },

  async getRefreshToken() {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
      }
      return await SecureStore.getItemAsync(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') localStorage.setItem(REFRESH_KEY, token);
      } else {
        await SecureStore.setItemAsync(REFRESH_KEY, token);
      }
    } catch (e) {
      console.error('Error saving refresh token', e);
    }
  },

  async removeRefreshToken() {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') localStorage.removeItem(REFRESH_KEY);
      } else {
        await SecureStore.deleteItemAsync(REFRESH_KEY);
      }
    } catch (e) {
      console.error('Error removing refresh token', e);
    }
  },
};
