import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { StaleDetectionService } from './stale-detection.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [IdeasController],
  providers: [IdeasService, StaleDetectionService], // 沉底检测服务
})
export class IdeasModule {}
