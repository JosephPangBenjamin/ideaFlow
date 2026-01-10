import dayjs from 'dayjs';

export type DueDateStatus = 'none' | 'normal' | 'approaching' | 'overdue';

export const APPROACHING_THRESHOLD_DAYS = 3;

/**
 * Determines the status of a due date relative to the current time.
 * @param dueDate The ISO date string of the deadline
 * @param now The current time (as a dayjs object for consistent comparison)
 * @returns DueDateStatus
 */
export const getDueDateStatus = (
  dueDate: string | null | undefined,
  now: dayjs.Dayjs = dayjs()
): DueDateStatus => {
  if (!dueDate) return 'none';
  const due = dayjs(dueDate);

  if (due.isBefore(now)) {
    return 'overdue';
  }

  const diffDays = due.diff(now, 'day');
  if (diffDays <= APPROACHING_THRESHOLD_DAYS) {
    return 'approaching';
  }

  return 'normal';
};
