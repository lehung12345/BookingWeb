import API from './api';

export const scheduleService = {
  getByDoctor: (doctorId) => API.get(`/schedules/doctor/${doctorId}`),
  getAvailable: (doctorId) => API.get(`/schedules/available/${doctorId}`),
  getMySchedules: () => API.get('/schedules/me'),
  create: (data) => API.post('/schedules', data),
  remove: (id) => API.delete(`/schedules/${id}`),
};
