import clsx from 'clsx';
import { Fragment, type ReactElement } from 'react';
import { Heading, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDate, DateTimeFormat } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';
import styles from './component.module.scss';

export function DashboardStatistics(): ReactElement {
  const { organisationName, firstDate, secondDate, averageDuration, count, averageSentiment, mostPopularTopic } =
    statisticsMock;

  const statistics = [
    { title: 'Call Count', change: count.change, value: count.secondMeasurement, date: secondDate },
    {
      title: 'Customer engagement',
      change: averageSentiment.change,
      value: averageSentiment.secondMeasurement,
      date: secondDate,
    },
    {
      title: 'Call duration',
      change: averageDuration.change,
      value: averageDuration.secondMeasurement,
      date: secondDate,
    },
    { title: 'Most popular topic', value: mostPopularTopic.secondMeasurement, date: secondDate },
  ];

  return (
    <Fragment>
      <div className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
        <Heading level={3}>{organisationName.toUpperCase()}</Heading>
        <div className='flex flex-row items-center gap-4'>
          <p className='underline'>{`${formatDate(firstDate, DateTimeFormat.MONTH_ONLY)}-${formatDate(secondDate, DateTimeFormat.MONTH_YEAR)}`}</p>
          <Icon name='calendar' />
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        {statistics.map(({ title, value, change, date }) => (
          <div
            key={title}
            className='w-full h-[120px] flex flex-col justify-between items-center bg-background-secondary rounded-2xl  pt-5 pb-6 px-8'>
            <div className='w-full flex flex-row justify-between items-start gap-2'>
              <p className='text-xs leading-[18px]'>{title.toUpperCase()}</p>
              {!!change && (
                <p
                  className={clsx(
                    'px-3 pt-1 pb-[2px] rounded-2xl font-medium leading-5 bg-background-primary',
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
        ))}
      </div>
    </Fragment>
  );
}
