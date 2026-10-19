import { describe, expect, it } from 'vitest';
import { formatPostDate } from './devto';

describe('formatPostDate', () => {
  it('formats an ISO timestamp as a short English date', () => {
    expect(formatPostDate('2026-08-15T10:30:00Z')).toBe('Aug 15, 2026');
  });

  it('keeps a date-only value on the same calendar day', () => {
    expect(formatPostDate('2026-01-02')).toBe('Jan 2, 2026');
  });
});
