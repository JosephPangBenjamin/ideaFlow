import { atom } from 'jotai';
import { NotificationSettings } from '@ideaflow/shared';

export const notificationSettingsAtom = atom<NotificationSettings | null>(null);
