import { DateTime } from 'luxon';
import { DateTimeFormat } from './enums';
import { formatDate } from './format-date';

export function formatDateRange(previousDate: DateTime, currentDate: DateTime): string {
  const sameYear = previousDate.year === currentDate.year;

  return `${formatDate(previousDate, sameYear ? DateTimeFormat.MONTH_ONLY : DateTimeFormat.MONTH_YEAR)}—${formatDate(
    currentDate,
    DateTimeFormat.MONTH_YEAR,
  )}`;
}
