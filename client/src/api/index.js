import { api } from './client';

export const sourcesApi = {
  list: (params = {}) => api.get('/sources?' + new URLSearchParams(params)),
  get: (id) => api.get(`/sources/${id}`),
  create: (data) => api.post('/sources', data),
  update: (id, data) => api.put(`/sources/${id}`, data),
  delete: (id) => api.delete(`/sources/${id}`),
};

export const buyersApi = {
  list: (params = {}) => api.get('/buyers?' + new URLSearchParams(params)),
  get: (id) => api.get(`/buyers/${id}`),
  create: (data) => api.post('/buyers', data),
  update: (id, data) => api.put(`/buyers/${id}`, data),
  delete: (id) => api.delete(`/buyers/${id}`),
};

export const tradesApi = {
  list: (params = {}) => api.get('/trades?' + new URLSearchParams(params)),
  get: (id) => api.get(`/trades/${id}`),
  create: (data) => api.post('/trades', data),
  update: (id, data) => api.put(`/trades/${id}`, data),
};

export const projectsApi = {
  list: (params = {}) => api.get('/projects?' + new URLSearchParams(params)),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const documentsApi = {
  list: (projectId) => api.get(`/projects/${projectId}/documents`),
  upload: (projectId, formData) => api.upload(`/projects/${projectId}/documents`, formData),
  delete: (projectId, docId) => api.delete(`/projects/${projectId}/documents/${docId}`),
  downloadUrl: (docId) => `/api/documents/${docId}/download`,
};

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
};

export const teamApi = {
  list: () => api.get('/team'),
  create: (data) => api.post('/team', data),
  update: (id, data) => api.put(`/team/${id}`, data),
};
