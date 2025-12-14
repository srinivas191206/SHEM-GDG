import api from './api';

export const register = async (email, password) => {
  const res = await api.post('/auth/register', { email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};