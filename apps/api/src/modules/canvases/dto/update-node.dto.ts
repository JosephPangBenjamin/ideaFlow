import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNodeDto {
  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  width?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  height?: number;

  @IsString()
  @IsOptional()
  content?: string; // Canvas V2

  @IsString()
  @IsOptional()
  imageUrl?: string; // Canvas V2

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  parentId?: string | null; // 允许设置为 null 解除关系
}
