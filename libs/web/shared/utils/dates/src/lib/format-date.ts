import { DateTime } from 'luxon';
import { DateTimeFormat } from './enums';

export const formatDate = (
  date: string | DateTime,
  format: DateTimeFormat = DateTimeFormat.DAY_SHORT_MONTH_YEAR,
): string => {
  const dateTime = typeof date === 'string' ? DateTime.fromFormat(date, DateTimeFormat.SHORT_MONTH_DAY_YEAR) : date;

  if (!dateTime.isValid) {
    return date.toString();
  }

  return dateTime.toFormat(format);
};
