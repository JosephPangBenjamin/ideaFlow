import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * 搜索模块
 * 提供全局搜索功能，搜索想法和任务
 */
@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
