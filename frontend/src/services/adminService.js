import API from './api';

export const adminService = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  createDoctor: (data) => API.post('/admin/doctors', data),
  updateDoctor: (id, data) => API.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => API.delete(`/admin/doctors/${id}`),
  getAllAppointments: () => API.get('/admin/appointments'),
  updateAppointmentStatus: (id, status) => API.put(`/admin/appointments/${id}/status`, { status }),
};
