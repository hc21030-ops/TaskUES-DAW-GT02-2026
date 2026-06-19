import { api } from './api';
 
export const userService = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },
 
  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
 
  update: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },
 
  remove: async (id) => {
    await api.delete(`/users/${id}`);
  },
};