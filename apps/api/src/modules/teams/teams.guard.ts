import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';

/**
 * Team Auth Guard
 * 检查用户是否为画布的团队成员
 * Story 8.2: 协作者注册加入
 */
@Injectable()
export class TeamAuthGuard implements CanActivate {
  constructor(private readonly teamsService: TeamsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT 认证后的用户

    if (!user) {
      throw new ForbiddenException('未授权访问');
    }

    // 从路由参数或请求体中获取画布 ID
    const canvasId = request.params.id || request.params.canvasId || request.body?.canvasId;

    if (!canvasId) {
      // 如果没有画布 ID，无法验证，允许通过（由具体业务逻辑处理）
      return true;
    }

    // 检查用户是否为画布成员
    const members = await this.teamsService.getCanvasMembers(canvasId);
    const isMember = members.data.some((member: any) => member.userId === user.id);

    if (!isMember) {
      throw new ForbiddenException('您不是该画布的成员，无权访问');
    }

    return true;
  }
}
