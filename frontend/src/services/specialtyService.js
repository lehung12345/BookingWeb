import API from './api';

export const specialtyService = {
  getAll: () => API.get('/specialties'),
  getById: (id) => API.get(`/specialties/${id}`),
  create: (data) => API.post('/specialties', data),
  update: (id, data) => API.put(`/specialties/${id}`, data),
  remove: (id) => API.delete(`/specialties/${id}`),
};
