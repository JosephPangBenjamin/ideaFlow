import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @UseGuards(JwtAuthGuard)
  async track(@Body() dto: TrackEventDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.userId;
    // We can run this without await if we want truly non-blocking response,
    // but fast writes are usually ok to await for confirmation.
    // For MVPs, awaiting ensures data integrity.
    await this.analyticsService.track(dto, userId);
    return { data: { success: true }, meta: {} };
  }
}
