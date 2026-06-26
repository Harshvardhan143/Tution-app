import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'eduspark_access_token';
const REFRESH_KEY = 'eduspark_refresh_token';

export const storage = {
  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (e) {
      console.error('Error saving token', e);
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Error removing token', e);
    }
  },

  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string) {
    try {
      await SecureStore.setItemAsync(REFRESH_KEY, token);
    } catch (e) {
      console.error('Error saving refresh token', e);
    }
  },

  async removeRefreshToken() {
    try {
      await SecureStore.deleteItemAsync(REFRESH_KEY);
    } catch (e) {
      console.error('Error removing refresh token', e);
    }
  },
};
