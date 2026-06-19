import { api } from './api';

export const categoryService = {
  getByProject: async (projectId) => {
    const { data } = await api.get(`/categories/proyecto/${projectId}`);
    return data;
  },

  create: async (category) => {
    const { data } = await api.post('/categories', category);
    return data;
  },

  update: async (id, category) => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },

  remove: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};