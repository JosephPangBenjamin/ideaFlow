import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Members Service
 * Story 8.2: 协作者注册加入
 * 目前仅作为占位符，实际逻辑在 TeamsService 中
 */
@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}
}
