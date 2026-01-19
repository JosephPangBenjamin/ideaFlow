import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService, SearchResult } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

/**
 * 全局搜索控制器
 * 提供 GET /ideaFlow/api/v1/search?q= 端点
 */
@Controller('ideaFlow/api/v1/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 执行全局搜索
   * @param query 搜索查询参数 (q 必填, 最少 2 字符)
   * @param req 请求对象（包含用户信息）
   * @returns 搜索结果 { ideas: [...], tasks: [...] }
   */
  @Get()
  async search(
    @Query() query: SearchQueryDto,
    @Request() req: { user: { sub: string } }
  ): Promise<SearchResult> {
    return this.searchService.search(req.user.sub, query.q);
  }
}
