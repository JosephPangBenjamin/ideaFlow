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
  category?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  ideaId?: string;

  @IsOptional()
  sources?: any; // IdeaSource[]
}
