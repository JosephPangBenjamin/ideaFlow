import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SharesService } from './shares.service';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Canvas Shares Controller
 * Story 8.1: 画布分享链接
 */
@Controller('canvases')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  /**
   * 生成分享链接
   * POST /canvases/:id/share
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  create(
    @Request() req: any,
    @Param('id') canvasId: string,
    @Body() createShareDto: CreateShareDto
  ) {
    return this.sharesService.create(req.user.id, canvasId, createShareDto);
  }

  /**
   * 更新/撤销分享
   * PATCH /canvases/:id/share/:token
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/share/:token')
  update(
    @Request() req: any,
    @Param('id') canvasId: string,
    @Param('token') token: string,
    @Body() updateShareDto: UpdateShareDto
  ) {
    return this.sharesService.update(req.user.id, canvasId, token, updateShareDto);
  }

  /**
   * 删除分享
   * DELETE /canvases/:id/share/:token
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/share/:token')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req: any, @Param('id') canvasId: string, @Param('token') token: string) {
    return this.sharesService.remove(req.user.id, canvasId, token);
  }

  /**
   * 列出所有分享链接
   * GET /canvases/:id/shares
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/shares')
  findAll(@Request() req: any, @Param('id') canvasId: string) {
    return this.sharesService.findAll(req.user.id, canvasId);
  }
}
