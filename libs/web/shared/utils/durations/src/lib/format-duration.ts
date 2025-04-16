import { Duration } from 'luxon';
import { DurationFormat } from './enums';

export const formatDuration = (
  duration: Duration,
  format: DurationFormat = DurationFormat.HOURS_MINUTES_SECONDS,
): string => {
  return duration.toFormat(format);
};
