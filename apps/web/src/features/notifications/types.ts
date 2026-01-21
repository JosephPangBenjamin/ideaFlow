// Import types from shared package using relative path
// Note: In a monorepo, this resolves to packages/shared/src/types/index.ts
import type {
  Notification as SharedNotification,
  NotificationType as SharedNotificationType,
  ApiResponse as SharedApiResponse,
} from '../../../../../packages/shared/src/types';

export type Notification = SharedNotification;
export type NotificationType = SharedNotificationType;
export type ApiResponse<T> = SharedApiResponse<T>;

export interface GetNotificationsParams {
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}
