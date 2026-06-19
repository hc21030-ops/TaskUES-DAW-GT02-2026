import { api } from './api';

export const projectService = {
  getAll: async () => {
    const { data } = await api.get('/projects');
    return data;
  },

  getByUserId: async (userId) => {
    const { data } = await api.get(`/projects/usuario/${userId}`);
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  create: async (project) => {
    const { data } = await api.post('/projects', project);
    return data;
  },

  update: async (id, project) => {
    const { data } = await api.put(`/projects/${id}`, project);
    return data;
  },

  remove: async (id) => {
    await api.delete(`/projects/${id}`);
  },
};