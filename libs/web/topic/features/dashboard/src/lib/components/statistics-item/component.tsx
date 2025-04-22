import clsx from 'clsx';
import { DateTime } from 'luxon';
import { type ReactElement } from 'react';
import { IconWithTooltip, IconWithTooltipProps } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import styles from './component.module.scss';

export interface StatisticsItemProps {
  title: string;
  value: string | number | null;
  change?: number | null;
  date: DateTime;
  tooltipProps: IconWithTooltipProps;
}

const longTitleLength = 13;

export function StatisticsItem({ title, value, change, date, tooltipProps }: StatisticsItemProps): ReactElement {
  return (
    <div className='w-full h-[120px] flex flex-col justify-between items-center bg-background-secondary rounded-2xl pt-5 pb-6 px-8'>
      <div className='w-full flex flex-row justify-between items-start gap-2'>
        <div className={clsx('flex items-start gap-2', !!change && title.length > longTitleLength && 'basis-[106px]')}>
          <p className='text-xs leading-[18px] uppercase '>{title}</p>
          <IconWithTooltip {...tooltipProps} />
        </div>
        {(change || change === 0) && (
          <p
            className={clsx(
              'text-center min-w-[60px] px-3 py-1 rounded-2xl font-medium leading-5 bg-background-primary whitespace-nowrap',
              change !== 0 && (change > 0 ? 'text-brand-success' : 'text-brand-secondary'),
            )}>
            {change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`}
          </p>
        )}
      </div>
      <div className='w-full flex flex-row justify-between items-end gap-2'>
        <p className={styles.statistics__value}>{typeof value === 'number' ? Math.round(value) : value}</p>
        <p className='text-text-secondary whitespace-nowrap uppercase'>{formatDate(date, DateTimeFormat.MONTH_YEAR)}</p>
      </div>
    </div>
  );
}
