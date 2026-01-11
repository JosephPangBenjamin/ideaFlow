import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  sources?: any[];
}
