import { IsOptional, IsEnum, IsString, IsDateString, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export enum TaskView {
  today = 'today',
  upcoming = 'upcoming',
  personal = 'personal',
  project = 'project',
}

export class GetTasksFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(TaskView)
  view?: TaskView;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'dueDate'])
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Story 8.3: 任务筛选字段
  @IsOptional()
  @IsString()
  assigneeId?: string; // 支持 "me" 特殊值

  @IsOptional()
  @IsString()
  createdBy?: string; // 支持 "me" 特殊值
}
