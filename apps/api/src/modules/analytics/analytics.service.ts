import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async track(dto: TrackEventDto, userId?: string) {
    try {
      await this.prisma.analyticsEvent.create({
        data: {
          eventName: dto.eventName,
          metadata: dto.metadata || {},
          userId,
        },
      });
    } catch (error) {
      // Log error but don't fail the request as analytics should be non-blocking/fail-safe
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to track event ${dto.eventName}: ${message}`);
    }
  }
}
