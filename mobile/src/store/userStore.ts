import { create } from 'zustand';
import { studentApi } from '../lib/api/student.api';
import { staffApi } from '../lib/api/staff.api';

interface UserState {
  profile: Record<string, unknown> | null;
  isLoading: boolean;
  fetchProfile: (role: 'student' | 'staff' | 'admin') => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async (role) => {
    try {
      set({ isLoading: true });
      let response;
      if (role === 'student') {
        response = await studentApi.getProfile();
      } else if (role === 'staff') {
        response = await staffApi.getProfile();
      } else {
        // Admin profile if needed
        response = { data: { name: 'Admin', role: 'admin' } };
      }
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch profile', error);
    }
  },

  clearProfile: () => {
    set({ profile: null });
  },
}));
