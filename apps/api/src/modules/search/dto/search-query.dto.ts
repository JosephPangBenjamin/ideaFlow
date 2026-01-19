import { IsNotEmpty, MinLength } from 'class-validator';

/**
 * 搜索查询参数 DTO
 * 验证搜索关键词必填且至少 2 个字符
 */
export class SearchQueryDto {
  @IsNotEmpty({ message: '搜索关键词不能为空' })
  @MinLength(2, { message: '搜索关键词至少需要 2 个字符' })
  q!: string;
}
