import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class TrackEventDto {
  @IsString()
  @IsNotEmpty()
  eventName!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
