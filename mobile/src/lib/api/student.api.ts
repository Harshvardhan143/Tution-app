import { apiClient } from './client';

export const studentApi = {
  getProfile: async () => {
    const res = await apiClient.get('/student/profile');
    return res.data;
  },
  getAttendance: async () => {
    const res = await apiClient.get('/student/attendance');
    return res.data;
  },
  getTimetable: async (startDate: string, endDate: string) => {
    const res = await apiClient.get(`/student/timetable?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  },
  getFees: async () => {
    const res = await apiClient.get('/student/fees');
    return res.data;
  },
  getResults: async () => {
    const res = await apiClient.get('/student/results');
    return res.data;
  },
  getLMS: async () => {
    const res = await apiClient.get('/student/lms');
    return res.data;
  },
  getCalendar: async () => {
    const res = await apiClient.get('/student/calendar');
    return res.data;
  },
  getAnnouncements: async () => {
    const res = await apiClient.get('/student/announcements');
    return res.data;
  },
  getExamSchedule: async () => {
    const res = await apiClient.get('/student/exam-schedule');
    return res.data;
  },
};
