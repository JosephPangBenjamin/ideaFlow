import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  ideaId?: string;

  @IsOptional()
  sources?: any; // IdeaSource[]

  // Story 8.3: 任务分配字段
  @IsUUID()
  @IsOptional()
  canvasId?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
