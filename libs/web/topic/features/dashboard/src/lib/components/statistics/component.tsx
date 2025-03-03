import { Fragment, type ReactElement } from 'react';
import { Heading, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDate, DateTimeFormat } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';

export function DashboardStatistics(): ReactElement {
  const { organisationName, firstDate, secondDate, averageDuration, count, averageSentiment, mostPopularTopic } =
    statisticsMock;

  const statistics = [
    { title: 'Call Count', change: count.change, value: count.secondMeasurement, date: 'Oct 2025' },
    {
      title: 'Customer engagement',
      change: averageSentiment.change,
      value: averageSentiment.secondMeasurement,
      date: 'Oct 2025',
    },
    {
      title: 'Call duration',
      change: averageDuration.change,
      value: averageDuration.secondMeasurement,
      date: 'Oct 2025',
    },
    { title: 'Most popular topic', value: mostPopularTopic.secondMeasurement, date: 'Oct 2025' },
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
            className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
            <p>{title}</p>
            <p>{value}</p>
            <p>{change}</p>
            <p>{date}</p>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
