'use client';

import { compact } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, General } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { StatisticsItem } from '../statistics-item';

const itemsConfig: Array<{ key: keyof General; label: string; hasChange?: boolean }> = [
  { key: 'count', label: 'TEXT_CALL_COUNT' },
  { key: 'averageSentiment', label: 'TEXT_CUSTOMER_ENGAGEMENT' },
  { key: 'averageDuration', label: 'TEXT_CALL_DURATION' },
  { key: 'mostPopularTopic', label: 'TEXT_MOST_POPULAR_TOPIC', hasChange: false },
];

export function DashboardStatistics(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.STATISTICS');
  const profile = useSelector(authSelectors.profile);

  const { data } = organizationApi.useGetOverviewDataQuery({ perTopic: true }, { skip: !profile });
  const { data: tr } = organizationApi.useGetOverviewDataQuery({}, { skip: !profile });
  const { secondDate, general } = data || {};

  console.log(data);

  const statisticsItems =
    general &&
    secondDate &&
    compact(
      itemsConfig.map(
        ({ key, label, hasChange = true }) =>
          general[key] && {
            title: t(label),
            change: hasChange ? general[key]?.change : undefined,
            value: general[key]?.firstMeasurement,
            date: secondDate,
          },
      ),
    );

  return (
    <div className='flex flex-row gap-2'>
      {statisticsItems && statisticsItems.map((itemProps) => <StatisticsItem key={itemProps.title} {...itemProps} />)}
    </div>
  );
}
