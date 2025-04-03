import { DateTime } from 'luxon';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';
import { formatDate, DateTimeFormat } from '@tellme/web/shared/utils/dates';

export const formatTick = (isoString: string, period: TrendPeriod): string => {
  const date = DateTime.fromISO(isoString);

  const formatter = {
    [TrendPeriod.MONTHLY]: () => formatDate(date, DateTimeFormat.MONTH_ONLY),
    [TrendPeriod.WEEKLY]: () => {
      const end = date.plus({ days: 6 });

      return `${formatDate(date, DateTimeFormat.DAY_ONLY)}-${formatDate(end, DateTimeFormat.DAY_MONTH)}`;
    },
    [TrendPeriod.DAILY]: () => formatDate(date, DateTimeFormat.DAY_MONTH),
  }[period];

  return formatter();
};
