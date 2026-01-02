import { api } from './api';

interface RegisterData {
    username: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface AuthResponse {
    user: {
        id: string;
        username: string;
    };
    accessToken: string;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },
};
