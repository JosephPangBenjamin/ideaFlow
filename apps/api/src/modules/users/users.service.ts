import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationSettings } from '@ideaflow/shared';
import { Prisma } from '@prisma/client';

interface CreateUserDto {
  username: string;
  password: string;
  phone?: string;
}

interface UpdateUserData {
  nickname?: string;
  phone?: string;
  username?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        phone: data.phone,
      },
    });
  }

  async update(id: string, data: UpdateUserData) {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    // Check if username is already taken
    if (data.username && data.username !== user.username) {
      const existingUser = await this.findByUsername(data.username);
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        nickname: data.nickname,
        phone: data.phone,
        username: data.username,
        avatarUrl: data.avatarUrl,
      },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // Verify old password
    if (!user.password) {
      throw new UnauthorizedException('用户未设置密码');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码错误');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and increment tokenVersion
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    return { success: true };
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationSettings: true },
    });

    if (!user || !user.notificationSettings) {
      return {
        globalLevel: 'all',
        types: {
          system: true,
          stale_reminder: true,
          task_reminder: true,
        },
      };
    }

    return user.notificationSettings as unknown as NotificationSettings;
  }

  async updateNotificationSettings(
    userId: string,
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    // Explicitly cast to InputJsonValue which Prisma expects for JSON fields
    const settingsJson = settings as unknown as Prisma.InputJsonValue;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationSettings: settingsJson,
      },
    });

    return user.notificationSettings as unknown as NotificationSettings;
  }
}
