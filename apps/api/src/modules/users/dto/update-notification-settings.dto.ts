import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { NotificationSettings, NotificationType } from '@ideaflow/shared';

export class UpdateNotificationSettingsDto implements NotificationSettings {
  @IsEnum(['all', 'important', 'none'])
  @IsOptional()
  globalLevel!: 'all' | 'important' | 'none';

  @IsObject()
  @IsOptional()
  types!: Partial<Record<NotificationType, boolean>>;
}
