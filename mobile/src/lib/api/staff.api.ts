import { apiClient } from './client';

export const staffApi = {
  getProfile: async () => {
    const res = await apiClient.get('/staff/profile');
    return res.data;
  },
  getTimetable: async (startDate: string, endDate: string) => {
    const res = await apiClient.get(`/staff/timetable?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  },
  getPendingAttendance: async () => {
    const res = await apiClient.get('/staff/attendance/pending');
    return res.data;
  },
  markAttendance: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/staff/attendance', data);
    return res.data;
  },
  getLeaves: async () => {
    const res = await apiClient.get('/staff/leave');
    return res.data;
  },
  getPayslips: async () => {
    const res = await apiClient.get('/staff/payslip');
    return res.data;
  },
};
