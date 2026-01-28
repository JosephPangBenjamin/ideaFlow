import { Controller, Get, Param, Render } from '@nestjs/common';
import { SharesService } from './shares.service';

/**
 * Shared Canvases Controller
 * 处理分享画布的公开访问路由（不带全局 API 前缀）
 * Story 8.1: 画布分享链接
 *
 * 路由: GET /shared/canvases/:token
 * 注意: 此 controller 不使用全局前缀 ideaFlow/api/v1
 */
@Controller('shared')
export class SharedCanvasesController {
  constructor(private readonly sharesService: SharesService) {}

  /**
   * 访问分享画布（无需 JWT）
   * GET /shared/canvases/:token
   */
  @Get('canvases/:token')
  async findByToken(@Param('token') token: string) {
    const result = await this.sharesService.findByToken(token);
    // 返回画布数据和权限信息
    return {
      data: {
        canvas: result.data.canvas,
        permission: result.data.permission,
        isAuthenticated: false, // 前端可根据此判断是否显示登录提示
      },
    };
  }
}
