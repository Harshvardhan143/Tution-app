import { apiClient } from './client';

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const res = await apiClient.post('/auth/forgot-password', data);
    return res.data;
  },
};
