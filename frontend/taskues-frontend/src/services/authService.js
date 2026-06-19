import { api } from './api';

export const authService = {
  login: async ({ email, password }) => {
    const { data: user } = await api.post('/auth/login', { email, password });

    return {
      user,
      token: 'session_' + user.userId + '_' + Date.now(),
    };
  },

  register: async ({ name, lastname, email, password }) => {
    const { data: user } = await api.post('/auth/register', {
      name,
      lastname,
      email,
      password,
    });

    return {
      user,
      token: 'session_' + user.userId + '_' + Date.now(),
    };
  },
};