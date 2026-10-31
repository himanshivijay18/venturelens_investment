import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('venturelens_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Do not redirect if already on login/signup/landing
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup' && path !== '/') {
        localStorage.removeItem('venturelens_token');
        localStorage.removeItem('venturelens_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const investorApi = {
  register: (data) => api.post('/investor/register', data),
  login: (data) => api.post('/investor/login', data),
  getAll: (params) => api.get('/investor/all', { params }),
  getById: (id) => api.get(`/investor/${id}`),
  getRecommendations: (investorId) => api.get(`/investor/${investorId}/recommendations`),
};

export const startupApi = {
  register: (data) => api.post('/startup/register', data),
  login: (data) => api.post('/startup/login', data),
  getAll: (params) => api.get('/startup/all', { params }),
  getById: (id) => api.get(`/startup/${id}`),
  update: (id, data) => api.put(`/startup/update/${id}`, data),
  getAiDiligence: (id, investorId) => api.get(`/startup/${id}/ai-diligence`, { params: { investorId } }),
};

export const savedStartupApi = {
  getSaved: (investorId) => api.get(`/saved-startups/${investorId}`),
  save: (investorId, startupId) => api.post(`/saved-startups/${investorId}/${startupId}`),
  remove: (investorId, startupId) => api.delete(`/saved-startups/${investorId}/${startupId}`),
};

export const meetingApi = {
  create: (data) => api.post('/meeting/create', data),
  getForInvestor: (investorId) => api.get(`/meeting/investor/${investorId}`),
  getForStartup: (startupId) => api.get(`/meeting/startup/${startupId}`),
  updateStatus: (id, status) => api.put(`/meeting/${id}/status`, { status }),
};

export const pitchDeckApi = {
  upload: (startupId, formData, onUploadProgress) =>
    api.post(`/pitch-deck/upload/${startupId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getInfo: (startupId) => api.get(`/pitch-deck/${startupId}`),
  getDownloadUrl: (startupId) => `/api/pitch-deck/download/${startupId}`,
};

export const adminApi = {
  login: (data) => api.post('/admin/login', data),
  getDashboard: () => api.get('/admin/dashboard'),
  getStartups: (params) => api.get('/admin/startups', { params }),
  getInvestors: (params) => api.get('/admin/investors', { params }),
  getMeetings: () => api.get('/admin/meetings'),
  updateStartupStatus: (id, isActive) => api.put(`/admin/startups/${id}/status`, { isActive }),
  updateInvestorStatus: (id, isActive) => api.put(`/admin/investors/${id}/status`, { isActive }),
  getAnalytics: () => api.get('/admin/analytics'),
};

export const authApi = {
  getMe: () => api.get('/auth/me'),
};

export default api;
