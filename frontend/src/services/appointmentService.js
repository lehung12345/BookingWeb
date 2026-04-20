import API from './api';

export const appointmentService = {
  book: (data) => API.post('/appointments', data),
  getMyAppointments: () => API.get('/appointments/my'),
  getDoctorAppointments: () => API.get('/appointments/doctor'),
  updateStatus: (id, data) => API.put(`/appointments/${id}/status`, data),
  cancel: (id) => API.put(`/appointments/${id}/cancel`),
};
