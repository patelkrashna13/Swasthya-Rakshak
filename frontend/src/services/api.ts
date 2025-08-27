import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id: string) => api.get(`/appointments/${id}`),
  createAppointment: (data: any) => api.post('/appointments', data),
  updateAppointment: (id: string, data: any) =>
    api.put(`/appointments/${id}`, data),
  cancelAppointment: (id: string) => api.delete(`/appointments/${id}`),
  getDoctorAvailability: (doctorId: string, date: string) =>
    api.get(`/appointments/availability?doctorId=${doctorId}&date=${date}`),
};

// Users API
export const usersAPI = {
  getDoctors: () => api.get('/users/doctors'),
  getDoctor: (id: string) => api.get(`/users/doctors/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export default api;
