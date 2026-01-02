import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL || 'http://localhost:3001';

export const api: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/ideaFlow/api/v1`,
    withCredentials: true,
});

export const createOnResponseError = (client: AxiosInstance) => async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
        if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        (originalRequest as any)._retry = true;

        try {
            await client.post('/auth/refresh');
            return client(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
};

export const onResponseError = createOnResponseError(api);

api.interceptors.response.use(
    (response) => response,
    onResponseError
);
