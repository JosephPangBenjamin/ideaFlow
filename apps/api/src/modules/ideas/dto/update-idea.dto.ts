import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateIdeaDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsObject()
  source?: any;
}
