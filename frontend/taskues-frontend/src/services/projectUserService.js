import { api } from './api';

export const projectUserService = {
  getByProjectId: async (projectId) => {
    const { data } = await api.get(`/project-users/proyecto/${projectId}`);
    return data;
  },

  addMember: async ({ projectId, userId, projectRole }) => {
    const { data } = await api.post('/project-users', { projectId, userId, projectRole });
    return data;
  },

  updateRole: async (id, rol) => {
    const { data } = await api.put(`/project-users/${id}/rol`, null, { params: { rol } });
    return data;
  },

  removeMember: async (id) => {
    await api.delete(`/project-users/${id}`);
  },
};