'use client';

import { compact } from 'lodash';
import { Duration } from 'luxon';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, General } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { formatDuration } from '@tellme/web/shared/utils/durations';
import { StatisticsItem } from '../statistics-item';

const itemsConfig: Array<{ key: keyof General; labelKey: string; hasChange?: boolean; isDuration?: boolean }> = [
  { key: 'count', labelKey: 'TEXT_CALL_COUNT' },
  { key: 'averageSentiment', labelKey: 'TEXT_CUSTOMER_ENGAGEMENT' },
  { key: 'averageDuration', labelKey: 'TEXT_CALL_DURATION', isDuration: true },
  { key: 'mostPopularTopic', labelKey: 'TEXT_MOST_POPULAR_TOPIC', hasChange: false },
];

export function DashboardStatistics(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.STATISTICS');
  const profile = useSelector(authSelectors.profile);

  const { data } = organizationApi.useGetGeneralOverviewQuery(undefined, { skip: !profile });
  const { currentMonth, general } = data || {};

  const statisticsItems =
    general &&
    currentMonth &&
    compact(
      itemsConfig.map(
        ({ key, labelKey, hasChange = true, isDuration }) =>
          general[key] && {
            title: t(labelKey),
            change: hasChange ? general[key]?.change : undefined,
            value: isDuration
              ? formatDuration(Duration.fromObject({ seconds: general[key].currentMeasurement as number }))
              : general[key]?.currentMeasurement,
            date: currentMonth,
          },
      ),
    );

  return (
    <div className='flex flex-row gap-2'>
      {statisticsItems?.map((itemProps) => <StatisticsItem key={itemProps.title} {...itemProps} />)}
    </div>
  );
}
