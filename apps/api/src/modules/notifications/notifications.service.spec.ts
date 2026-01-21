import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;
  let usersService: UsersService;

  const mockNotification = {
    id: 'noti-1',
    userId: 'user-1',
    type: NotificationType.stale_reminder,
    title: 'Test Title',
    message: 'Test Message',
    data: { count: 5 },
    isRead: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: UsersService,
          useValue: {
            getNotificationSettings: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = testingModule.get<NotificationsService>(NotificationsService);
    prisma = testingModule.get<PrismaService>(PrismaService);
    usersService = testingModule.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification if allowed', async () => {
      const dto = {
        type: NotificationType.system,
        title: 'Test',
        message: 'Hello',
      };
      (usersService.getNotificationSettings as jest.Mock).mockResolvedValue({
        globalLevel: 'all',
        types: { system: true },
      });
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.create('user-1', dto);

      expect(prisma.notification.create).toHaveBeenCalled();
      expect(result).toEqual(mockNotification);
    });

    it('should block notification if globalLevel is none', async () => {
      const dto = { type: NotificationType.system, title: 'T', message: 'M' };
      (usersService.getNotificationSettings as jest.Mock).mockResolvedValue({
        globalLevel: 'none',
        types: { system: true },
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeNull();
      expect(prisma.notification.create).not.toHaveBeenCalled();
    });

    it('should block notification if specific type is disabled', async () => {
      const dto = { type: NotificationType.stale_reminder, title: 'T', message: 'M' };
      (usersService.getNotificationSettings as jest.Mock).mockResolvedValue({
        globalLevel: 'all',
        types: { stale_reminder: false },
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeNull();
      expect(prisma.notification.create).not.toHaveBeenCalled();
    });

    it('should allow important notification even if globalLevel is important', async () => {
      const dto = { type: NotificationType.system, title: 'T', message: 'M' };
      (usersService.getNotificationSettings as jest.Mock).mockResolvedValue({
        globalLevel: 'important',
        types: { system: true },
      });
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.create('user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.notification.create).toHaveBeenCalled();
    });

    it('should block non-important notification if globalLevel is important', async () => {
      const dto = { type: NotificationType.stale_reminder, title: 'T', message: 'M' };
      (usersService.getNotificationSettings as jest.Mock).mockResolvedValue({
        globalLevel: 'important',
        types: { stale_reminder: true },
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeNull();
      expect(prisma.notification.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated notifications', async () => {
      const userId = 'user-1';
      const dto = { page: 1, pageSize: 20 };
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([mockNotification]);
      (prisma.notification.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll(userId, dto);

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(result.data).toEqual([mockNotification]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const id = 'not-1';
      const userId = 'user-1';
      const updated = { ...mockNotification, isRead: true };
      (prisma.notification.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.markAsRead(userId, id);

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id, userId },
        data: { isRead: true },
      });
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      const userId = 'user-1';
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(userId);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      expect(result.count).toBe(5);
    });
  });

  describe('getUnreadCount', () => {
    it('should return the count of unread notifications', async () => {
      const userId = 'user-1';
      (prisma.notification.count as jest.Mock).mockResolvedValue(3);

      const result = await service.getUnreadCount(userId);

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId, isRead: false },
      });
      expect(result).toBe(3);
    });
  });

  describe('hasSentTodayByType', () => {
    it('should return true if notification of type was sent today', async () => {
      const userId = 'user-1';
      const type = NotificationType.stale_reminder;
      (prisma.notification.count as jest.Mock).mockResolvedValue(1);

      const result = await service.hasSentTodayByType(userId, type);

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId,
          type,
          createdAt: { gte: expect.any(Date) },
        },
      });
      expect(result).toBe(true);
    });
  });
});
