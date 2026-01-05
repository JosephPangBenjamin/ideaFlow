import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  ideaId!: string;

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
}
