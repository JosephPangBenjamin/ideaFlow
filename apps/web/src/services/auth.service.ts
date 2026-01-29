import { api } from './api';

interface RegisterData {
  username: string;
  password: string;
  inviteToken?: string; // 可选的邀请链接 token
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
  redirectUrl?: string; // 注册后的重定向 URL（如果有）
  warning?: string; // 警告信息（例如：邀请链接无效）
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
