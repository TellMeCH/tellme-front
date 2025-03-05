import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { statisticsMock } from '../../mocks/statistics';
import { StatisticsItem, StatisticsItemProps } from '../statistics-item';

export function DashboardStatistics(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.STATISTICS');
  const { secondDate, averageDuration, count, averageSentiment, mostPopularTopic } = statisticsMock;

  const statisticsItems: Array<StatisticsItemProps> = [
    { title: t('TEXT_CALL_COUNT'), change: count.change, value: count.secondMeasurement, date: secondDate },
    {
      title: t('TEXT_CUSTOMER_ENGAGEMENT'),
      change: averageSentiment.change,
      value: averageSentiment.secondMeasurement,
      date: secondDate,
    },
    {
      title: t('TEXT_CALL_DURATION'),
      change: averageDuration.change,
      value: averageDuration.secondMeasurement,
      date: secondDate,
    },
    { title: t('TEXT_MOST_POPULAR_TOPIC'), value: mostPopularTopic.secondMeasurement, date: secondDate },
  ];

  return (
    <div className='flex flex-row gap-2'>
      {statisticsItems.map((itemProps) => (
        <StatisticsItem key={itemProps.title} {...itemProps} />
      ))}
    </div>
  );
}
