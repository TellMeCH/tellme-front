'use client';

import { organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { statisticsMock } from '../../mocks/statistics';
import { StatisticsItem, StatisticsItemProps } from '../statistics-item';

export function DashboardStatistics(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.STATISTICS');
  const profile = useSelector(authSelectors.profile);

  const { data, isFetching } = organizationApi.useGetOverviewDataQuery({}, { skip: !profile });
  const { data: a } = organizationApi.useGetOrganizationQuery({ id: 162 }, { skip: !profile });
  // const { data: data1s, isFetching: i } = topicApi.useGetActiveListQuery({}, { skip: !profile });

  console.log(data);
  console.log(a);

  const { secondDate, averageDuration, count, averageSentiment, mostPopularTopic } = statisticsMock.general;

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
