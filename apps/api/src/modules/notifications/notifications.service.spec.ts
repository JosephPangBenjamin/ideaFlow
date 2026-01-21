import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
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

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const dto = {
        type: NotificationType.stale_reminder,
        title: 'Test',
        message: 'Hello',
        data: { x: 1 },
      };
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.create('user-1', dto);

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          ...dto,
        },
      });
      expect(result).toEqual(mockNotification);
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

    it('should filter by isRead', async () => {
      const userId = 'user-1';
      const dto = { page: 1, pageSize: 20, isRead: false };
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([mockNotification]);
      (prisma.notification.count as jest.Mock).mockResolvedValue(1);

      await service.findAll(userId, dto);

      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, isRead: false },
        })
      );
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

    it('should return false if no notification of type was sent today', async () => {
      (prisma.notification.count as jest.Mock).mockResolvedValue(0);
      const result = await service.hasSentTodayByType('u1', NotificationType.system);
      expect(result).toBe(false);
    });
  });
});
