import API from './api';

export const adminService = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  createDoctor: (data, avatarFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    return API.post('/admin/doctors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateDoctor: (id, data, avatarFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    return API.put(`/admin/doctors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteDoctor: (id) => API.delete(`/admin/doctors/${id}`),
  getAllAppointments: () => API.get('/admin/appointments'),
  updateAppointmentStatus: (id, status) => API.put(`/admin/appointments/${id}/status`, { status }),
};
