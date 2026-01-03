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
import { UpdateUserDto, ChangePasswordDto } from './dto';
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
        phone: user.phone,
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
        phone: updatedUser.phone,
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
}
