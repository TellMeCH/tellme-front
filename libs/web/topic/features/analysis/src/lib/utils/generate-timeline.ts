import { DateTime, Interval } from 'luxon';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';

export const generateTimeline = (period: TrendPeriod): Array<Interval> => {
  const now = DateTime.now();

  const config: Record<TrendPeriod, { count: number; unit: 'months' | 'weeks' | 'days'; start: DateTime }> = {
    [TrendPeriod.MONTHLY]: {
      count: 12,
      unit: 'months',
      start: now.startOf('month').minus({ months: 11 }),
    },
    //NOTE: Not calendar weeks
    [TrendPeriod.WEEKLY]: {
      count: 12,
      unit: 'weeks',
      start: now.startOf('day').minus({ days: 7 * 11 + 6 }),
    },
    [TrendPeriod.DAILY]: {
      count: 30,
      unit: 'days',
      start: now.startOf('day').minus({ days: 29 }),
    },
  };

  const { count, unit, start } = config[period];

  return Array.from({ length: count }, (_, i) => {
    const bucketStart = start.plus({ [unit]: i });
    const bucketEnd = bucketStart.plus({ [unit]: 1 });

    return Interval.fromDateTimes(bucketStart, bucketEnd);
  });
};
