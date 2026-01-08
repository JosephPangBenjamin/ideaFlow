import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { CanvasNodeType } from '@prisma/client';

export class CreateNodeDto {
  @IsEnum(CanvasNodeType)
  @IsOptional()
  type?: CanvasNodeType = CanvasNodeType.sub_idea; // Canvas V2: 节点类型

  @IsString()
  @IsOptional()
  ideaId?: string; // 仅 master_idea 类型需要

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

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
  content?: string; // Canvas V2: 用于 sub_idea/annotation

  @IsString()
  @IsOptional()
  imageUrl?: string; // Canvas V2: 用于 image 类型

  @IsString()
  @IsOptional()
  color?: string; // 区域背景颜色

  @IsString()
  @IsOptional()
  parentId?: string; // 层级关系（父节点ID）

  @IsOptional()
  style?: any;
}
