import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsOptional()
  @IsObject()
  source?: any; // Using any for JSONB flexibility, or strictly typed DTO if desired
}
