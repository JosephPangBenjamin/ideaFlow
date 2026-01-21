import { Test, TestingModule } from '@nestjs/testing';
import { StaleReminderService } from './stale-reminder.service';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

describe('StaleReminderService', () => {
  let service: StaleReminderService;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaleReminderService,
        {
          provide: PrismaService,
          useValue: {
            idea: {
              groupBy: jest.fn(),
            },
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            hasSentTodayByType: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaleReminderService>(StaleReminderService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendReminders', () => {
    it('should not send notifications when no users have stale ideas', async () => {
      (prisma.idea.groupBy as jest.Mock).mockResolvedValue([]);

      await service.sendReminders();

      expect(notificationsService.create).not.toHaveBeenCalled();
    });

    it('should send notifications to users with stale ideas', async () => {
      const usersWithStale = [
        { userId: 'user-1', _count: 3 },
        { userId: 'user-2', _count: 5 },
      ];
      (prisma.idea.groupBy as jest.Mock).mockResolvedValue(usersWithStale);
      (notificationsService.hasSentTodayByType as jest.Mock).mockResolvedValue(false);
      (notificationsService.create as jest.Mock).mockResolvedValue({});

      await service.sendReminders();

      expect(notificationsService.create).toHaveBeenCalledTimes(2);
      expect(notificationsService.create).toHaveBeenCalledWith('user-1', {
        type: NotificationType.stale_reminder,
        title: '沉底点子提醒',
        message: '你有 3 个想法放了超过 7 天，要不要看看？',
        data: { staleCount: 3 },
      });
      expect(notificationsService.create).toHaveBeenCalledWith('user-2', {
        type: NotificationType.stale_reminder,
        title: '沉底点子提醒',
        message: '你有 5 个想法放了超过 7 天，要不要看看？',
        data: { staleCount: 5 },
      });
    });

    it('should skip users who already received a reminder today (anti-spam)', async () => {
      const usersWithStale = [
        { userId: 'user-1', _count: 3 },
        { userId: 'user-2', _count: 5 },
      ];
      (prisma.idea.groupBy as jest.Mock).mockResolvedValue(usersWithStale);
      // user-1 already received, user-2 did not
      (notificationsService.hasSentTodayByType as jest.Mock)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      (notificationsService.create as jest.Mock).mockResolvedValue({});

      await service.sendReminders();

      // Only user-2 should receive notification
      expect(notificationsService.create).toHaveBeenCalledTimes(1);
      expect(notificationsService.create).toHaveBeenCalledWith(
        'user-2',
        expect.objectContaining({
          type: NotificationType.stale_reminder,
        })
      );
    });

    it('should call groupBy with correct parameters', async () => {
      (prisma.idea.groupBy as jest.Mock).mockResolvedValue([]);

      await service.sendReminders();

      expect(prisma.idea.groupBy).toHaveBeenCalledWith({
        by: ['userId'],
        where: {
          isStale: true,
          deletedAt: null,
        },
        _count: true,
      });
    });
  });
});
