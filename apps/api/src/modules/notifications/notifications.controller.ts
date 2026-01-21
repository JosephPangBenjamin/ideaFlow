import { Controller, Get, Post, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Req() req: Request, @Query() dto: GetNotificationsDto) {
    return this.notificationsService.findAll((req.user as any).id, dto);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const count = await this.notificationsService.getUnreadCount((req.user as any).id);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    return this.notificationsService.markAsRead((req.user as any).id, id);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: Request) {
    const result = await this.notificationsService.markAllAsRead((req.user as any).id);
    return { count: result.count };
  }
}
