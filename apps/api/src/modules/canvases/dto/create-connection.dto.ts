import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateConnectionDto {
  @IsString()
  @IsNotEmpty()
  fromNodeId!: string;

  @IsString()
  @IsNotEmpty()
  toNodeId!: string;

  @IsString()
  @IsOptional()
  label?: string;
}
