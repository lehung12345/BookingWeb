import API from './api';

export const doctorService = {
  getAll: () => API.get('/doctors'),
  getById: (id) => API.get(`/doctors/${id}`),
  getMe: () => API.get('/doctors/me'),
  updateProfile: (formData) => API.put('/doctors/me', formData),
  getBySpecialty: (specialtyId) => API.get(`/doctors/specialty/${specialtyId}`),
};
