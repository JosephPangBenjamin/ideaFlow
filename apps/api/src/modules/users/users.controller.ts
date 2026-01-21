import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto, UpdateNotificationSettingsDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const userPayload = (req as any).user;
    const user = await this.usersService.findById(userPayload.id);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      data: {
        id: user.id,
        username: user.username,
        phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null,
        nickname: user.nickname,
        avatarUrl: (user as any).avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      meta: {},
    };
  }

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userPayload = (req as any).user;
    const updatedUser = await this.usersService.update(userPayload.id, updateUserDto);

    if (!updatedUser) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        phone: updatedUser.phone
          ? updatedUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          : null,
        nickname: updatedUser.nickname,
        avatarUrl: (updatedUser as any).avatarUrl,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      meta: {
        message: '保存成功',
      },
    };
  }

  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto) {
    const userPayload = (req as any).user;

    await this.usersService.changePassword(
      userPayload.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword
    );

    return {
      data: null,
      meta: {
        message: '密码修改成功，请重新登录',
      },
    };
  }

  @Get('me/notification-settings')
  async getNotificationSettings(@Req() req: Request) {
    const userPayload = (req as any).user;
    const settings = await this.usersService.getNotificationSettings(userPayload.id);

    return {
      data: settings,
      meta: {},
    };
  }

  @Patch('me/notification-settings')
  async updateNotificationSettings(
    @Req() req: Request,
    @Body() updateDto: UpdateNotificationSettingsDto
  ) {
    const userPayload = (req as any).user;
    const settings = await this.usersService.updateNotificationSettings(userPayload.id, updateDto);

    return {
      data: settings,
      meta: {
        message: '保存成功',
      },
    };
  }
}
