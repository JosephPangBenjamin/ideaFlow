import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateIdeaDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  sources?: any[];
}
