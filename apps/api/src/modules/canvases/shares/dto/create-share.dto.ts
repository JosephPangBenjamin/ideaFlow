import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Permission } from '@prisma/client';

/**
 * 创建分享链接 DTO
 * Story 8.1: 画布分享链接
 */
export class CreateShareDto {
  /**
   * 权限类型：VIEW_ONLY（仅查看）或 EDITABLE（可编辑）
   * 默认: VIEW_ONLY
   */
  @IsEnum(Permission, {
    message: '权限必须是 VIEW_ONLY 或 EDITABLE',
  })
  @IsOptional()
  permission?: Permission = Permission.VIEW_ONLY;

  /**
   * 过期时间（可选）
   * 格式: ISO 8601 日期字符串
   */
  @IsDateString({}, { message: '过期时间格式无效' })
  @IsOptional()
  expiresAt?: string;
}
