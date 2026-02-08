import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
  getMe: () => api.get('/auth/me'),
};

export const questionsAPI = {
  getAll: (params?: any) => api.get('/questions', { params }),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: any) => api.post('/questions', data),
  resolve: (id: string, outcome: string) => 
    api.post(`/questions/${id}/resolve`, { outcome }),
};

export const predictionsAPI = {
  create: (questionId: string, probability: number) => 
    api.post('/predictions', { questionId, probability }),
  getMine: () => api.get('/predictions/me'),
};

export const leaderboardAPI = {
  getAll: (params?: any) => api.get('/leaderboard', { params }),
};

export const usersAPI = {
  getById: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: any) => api.put('/users/me', data),
};
