import { api } from './api';

export interface UserProfile {
  id: string;
  username: string;
  phone: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  nickname?: string;
  phone?: string;
  username?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  async getMe(): Promise<{ data: UserProfile; meta: any }> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateMe(data: UpdateUserDto): Promise<{ data: UserProfile; meta: { message: string } }> {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordDto): Promise<{ data: any; meta: { message: string } }> {
    const response = await api.post('/users/me/change-password', data);
    return response.data;
  },
};
