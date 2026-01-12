import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  return dayjs(dateStr).fromNow();
}

export function formatFullTime(dateStr: string): string {
  if (!dateStr) return '';
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
}
