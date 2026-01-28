import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { SharesService } from '../shares/shares.service';

/**
 * Share Auth Guard
 * 验证分享链接有效性的 Guard
 * Story 8.1: 画布分享链接
 */
@Injectable()
export class ShareAuthGuard implements CanActivate {
  constructor(private readonly sharesService: SharesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    if (!token) {
      throw new NotFoundException('分享链接缺失');
    }

    try {
      // 验证分享链接
      const share = await this.sharesService.findByToken(token);

      // 将分享信息附加到 request，供后续使用
      request.canvasShare = share.data;

      return true;
    } catch {
      throw new NotFoundException('分享链接不存在或已过期');
    }
  }
}
