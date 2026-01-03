import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL || '';

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/ideaFlow/api/v1`,
  withCredentials: true,
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('ideaflow-auth');
  if (authData) {
    try {
      const { accessToken } = JSON.parse(authData);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return config;
});

export const createOnResponseError = (client: AxiosInstance) => async (error: AxiosError) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    try {
      const response = await client.post('/auth/refresh');
      const { accessToken } = response.data;

      // Save new token to localStorage
      const authData = localStorage.getItem('ideaflow-auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          localStorage.setItem('ideaflow-auth', JSON.stringify({ ...parsed, accessToken }));
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Retry original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return client(originalRequest);
    } catch (refreshError) {
      // Clear auth on refresh failure
      localStorage.removeItem('ideaflow-auth');
      window.location.hash = '/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

export const onResponseError = createOnResponseError(api);

api.interceptors.response.use((response) => response, onResponseError);
