import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Permission, ShareStatus } from '@prisma/client';

/**
 * 更新分享链接 DTO
 * Story 8.1: 画布分享链接
 */
export class UpdateShareDto {
  /**
   * 权限类型：VIEW_ONLY（仅查看）或 EDITABLE（可编辑）
   */
  @IsEnum(Permission, {
    message: '权限必须是 VIEW_ONLY 或 EDITABLE',
  })
  @IsOptional()
  permission?: Permission;

  /**
   * 过期时间（可选）
   * 格式: ISO 8601 日期字符串
   */
  @IsDateString({}, { message: '过期时间格式无效' })
  @IsOptional()
  expiresAt?: string;

  /**
   * 分享状态：ACTIVE（有效）或 REVOKED（已撤销）
   * 用于撤销分享链接
   */
  @IsEnum(ShareStatus, {
    message: '状态必须是 ACTIVE 或 REVOKED',
  })
  @IsOptional()
  status?: ShareStatus;
}
