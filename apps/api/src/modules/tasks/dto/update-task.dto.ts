import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, validateIf } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  // Story 8.3: 任务分配字段（支持 null 以清除分配）
  @IsUUID()
  @IsOptional()
  canvasId?: string | null;

  @IsUUID()
  @IsOptional()
  assigneeId?: string | null;
}
