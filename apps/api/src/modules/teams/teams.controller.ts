import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamAuthGuard } from './teams.guard';
import { TeamsService } from './teams.service';

@Controller('ideaFlow/api/v1')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * 通过邀请链接加入团队（已登录用户）
   * POST /ideaFlow/api/v1/teams/join/:shareToken
   */
  @Post('teams/join/:shareToken')
  @UseGuards(JwtAuthGuard)
  async joinByShareToken(@Request() req: any, @Param('shareToken') shareToken: string) {
    const userId = req.user.id;

    const member = await this.teamsService.joinByShareToken(userId, shareToken);

    return { data: member };
  }

  /**
   * 列出团队成员
   * GET /ideaFlow/api/v1/teams/:id/members
   * 需要验证用户是否为该团队成员（但当前 MVP 阶段暂不强制）
   */
  @Get('teams/:id/members')
  @UseGuards(JwtAuthGuard)
  async getTeamMembers(@Param('id') teamId: string) {
    return await this.teamsService.getTeamMembers(teamId);
  }

  /**
   * 列出画布成员（包含通过分享链接加入的）
   * GET /ideaFlow/api/v1/canvases/:id/members
   * 需要验证用户是否为画布成员
   */
  @Get('canvases/:id/members')
  @UseGuards(JwtAuthGuard, TeamAuthGuard)
  async getCanvasMembers(@Param('id') canvasId: string) {
    return await this.teamsService.getCanvasMembers(canvasId);
  }

  /**
   * 获取画布关联团队信息
   * GET /ideaFlow/api/v1/canvases/:id/team
   * 需要验证用户是否为画布成员
   */
  @Get('canvases/:id/team')
  @UseGuards(JwtAuthGuard, TeamAuthGuard)
  async getCanvasTeamInfo(@Param('id') canvasId: string) {
    return await this.teamsService.getCanvasTeamInfo(canvasId);
  }
}
