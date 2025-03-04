import clsx from 'clsx';
import { DateTime } from 'luxon';
import { type ReactElement } from 'react';
import { DateTimeFormat } from '@tellme/web/shared/utils/dates';
import styles from './component.module.scss';

export interface StatisticsItemProps {
  title: string;
  value: string | number;
  change?: number;
  date: DateTime;
}

export function StatisticsItem({ title, value, change, date }: StatisticsItemProps): ReactElement {
  return (
    <div className='w-full h-[120px] flex flex-col justify-between items-center bg-background-secondary rounded-2xl pt-5 pb-6 px-8'>
      <div className='w-full flex flex-row justify-between items-start gap-2'>
        <p className='text-xs leading-[18px]'>{title.toUpperCase()}</p>
        {!!change && (
          <p
            className={clsx(
              'px-3 py-1 rounded-2xl font-medium leading-5 bg-background-primary whitespace-nowrap',
              change > 0 ? 'text-brand-success' : 'text-brand-secondary',
            )}>
            {change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`}
          </p>
        )}
      </div>
      <div className='w-full flex flex-row justify-between items-end gap-2'>
        <p className={clsx('w-min', styles.statistics__value)}>{value}</p>
        <p className='text-text-secondary whitespace-nowrap'>
          {date.toFormat(DateTimeFormat.MONTH_YEAR).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
