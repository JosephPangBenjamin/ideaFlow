import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCanvasDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  ideaId?: string; // Canvas V2: 关联的核心想法
}
