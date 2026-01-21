import { atom } from 'jotai';
import { Notification } from '../types';

// 通知列表
export const notificationsAtom = atom<Notification[]>([]);

// 未读数量
export const unreadCountAtom = atom<number>(0);

// 加载状态
export const isLoadingNotificationsAtom = atom<boolean>(false);

// 分页状态
export const notificationsPageAtom = atom<number>(1);
export const notificationsHasMoreAtom = atom<boolean>(true);
