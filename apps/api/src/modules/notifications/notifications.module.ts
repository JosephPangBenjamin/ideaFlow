import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { StaleReminderService } from './stale-reminder.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, StaleReminderService],
  exports: [NotificationsService, StaleReminderService],
})
export class NotificationsModule {}
