import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCanvasDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
