import { create } from 'zustand';
import { storage } from '../lib/storage';
import { authApi } from '../lib/api/auth.api';

interface AuthState {
  isAuthenticated: boolean;
  role: 'student' | 'staff' | 'admin' | null;
  isLoading: boolean;
  login: (data: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  isLoading: true,

  login: async (data: Record<string, unknown>) => {
    try {
      set({ isLoading: true });
      const response = await authApi.login(data);
      
      await storage.setToken(response.data.accessToken);
      await storage.setRefreshToken(response.data.refreshToken);
      
      set({ 
        isAuthenticated: true, 
        role: response.data.user.role,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authApi.logout();
    } catch {
      // Ignore API errors on logout
    } finally {
      await storage.removeToken();
      await storage.removeRefreshToken();
      set({ isAuthenticated: false, role: null, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await storage.getToken();
      if (!token) {
        set({ isAuthenticated: false, role: null, isLoading: false });
        return;
      }
      
      const response = await authApi.getMe();
      set({ 
        isAuthenticated: true, 
        role: response.data.role,
        isLoading: false 
      });
    } catch {
      await storage.removeToken();
      await storage.removeRefreshToken();
      set({ isAuthenticated: false, role: null, isLoading: false });
    }
  },
}));
