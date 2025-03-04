import { type ReactElement } from 'react';
import { statisticsMock } from '../../mocks/statistics';
import { StatisticsItem, StatisticsItemProps } from '../statistics-item/component';

export function DashboardStatistics(): ReactElement {
  const { secondDate, averageDuration, count, averageSentiment, mostPopularTopic } = statisticsMock;

  const statisticsItems: Array<StatisticsItemProps> = [
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
    <div className='flex flex-row gap-2'>
      {statisticsItems.map((itemProps) => (
        <StatisticsItem key={itemProps.title} {...itemProps} />
      ))}
    </div>
  );
}
