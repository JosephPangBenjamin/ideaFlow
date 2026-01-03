import { IsUrl, IsNotEmpty } from 'class-validator';

export class PreviewUrlDto {
  @IsNotEmpty()
  @IsUrl()
  url!: string;
}
