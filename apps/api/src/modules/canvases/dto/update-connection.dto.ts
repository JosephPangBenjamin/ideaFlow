import { IsString, IsOptional } from 'class-validator';

export class UpdateConnectionDto {
  @IsString()
  @IsOptional()
  label?: string;
}
