import { api } from './api';

export const taskService = {
  getByProject: async (projectId) => {
    const { data } = await api.get(`/tasks/proyecto/${projectId}`);
    return data;
  },

  getByUser: async (userId) => {
    const { data } = await api.get(`/tasks/usuario/${userId}`);
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  create: async (task) => {
    const { data } = await api.post('/tasks', task);
    return data;
  },

  update: async (id, task) => {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data;
  },

  moveToState: async (id, estado) => {
    const { data } = await api.patch(`/tasks/${id}/estado`, null, {
      params: { estado },
    });
    return data;
  },

  remove: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};