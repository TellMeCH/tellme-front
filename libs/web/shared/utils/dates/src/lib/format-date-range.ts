import { DateTime } from 'luxon';
import { DateTimeFormat } from './enums';
import { formatDate } from './format-date';

export function formatDateRange(firstDate: DateTime, secondDate: DateTime): string {
  const sameYear = firstDate.year === secondDate.year;

  return `${formatDate(firstDate, sameYear ? DateTimeFormat.MONTH_ONLY : DateTimeFormat.MONTH_YEAR)}—${formatDate(
    secondDate,
    DateTimeFormat.MONTH_YEAR,
  )}`;
}
