import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { statisticsMock } from '../../mocks/statistics';

export function DashboardTopicTrends(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.STATISTICS');
  const { secondDate, averageDuration, count, averageSentiment, mostPopularTopic } = statisticsMock;

  return (
    <div className='flex-1 bg-background-secondary rounded-2xl'>
      <p>Test</p>
    </div>
  );
}
