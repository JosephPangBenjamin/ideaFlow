import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCanvasDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
