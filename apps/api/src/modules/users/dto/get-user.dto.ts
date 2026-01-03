import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsNotEmpty()
  createdAt!: string;

  @IsString()
  @IsNotEmpty()
  updatedAt!: string;
}
