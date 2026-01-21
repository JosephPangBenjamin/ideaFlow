import { IsOptional, IsDateString, IsNumber, Min, IsIn, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetIdeasFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt'])
  sortBy?: 'createdAt' | 'updatedAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isStale?: boolean; // 沉底筛选：?isStale=true
}
