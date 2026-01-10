import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
// We'll test the logic by mocking the component or just testing the pure parts if we extract them.
// For now, let's just use dayjs to verify the same logic we have in the component.

import { getDueDateStatus } from '../utils/task-utils';

describe('getDueDateStatus logic', () => {
  const now = dayjs('2026-01-10T12:00:00Z');

  it('should return none for empty dueDate', () => {
    expect(getDueDateStatus(null, now)).toBe('none');
    expect(getDueDateStatus(undefined, now)).toBe('none');
  });

  it('should return overdue for past dates', () => {
    const pastDate = '2026-01-09T12:00:00Z';
    expect(getDueDateStatus(pastDate, now)).toBe('overdue');
  });

  it('should return approaching for dates within 3 days', () => {
    const approachingDate = '2026-01-12T12:00:00Z';
    expect(getDueDateStatus(approachingDate, now)).toBe('approaching');
  });

  it('should return approaching for today', () => {
    const today = '2026-01-10T15:00:00Z';
    expect(getDueDateStatus(today, now)).toBe('approaching');
  });

  it('should return normal for dates further than 3 days', () => {
    const farDate = '2026-01-15T12:00:00Z';
    expect(getDueDateStatus(farDate, now)).toBe('normal');
  });
});
