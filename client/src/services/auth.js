import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw new Error('Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};
