import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getLiveSensorData = async () => api.get('/data/live');
export const getHistoryData = async () => api.get('/data/history');
export const getSevenDayHistoryData = async () => api.get('/data/history/7day');
export const getEsp32LatestData = async () => {
  try {
    const response = await api.get('/esp32data');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default api;