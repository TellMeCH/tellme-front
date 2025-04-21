'use client';

import { TooltipProps } from '@heroui/react';
import { compact } from 'lodash';
import { Duration } from 'luxon';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, General } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { formatDuration } from '@tellme/web/shared/utils/durations';
import { StatisticsItem } from '../statistics-item';

interface ConfigItem {
  key: keyof General;
  labelKey: string;
  tooltipKey: string;
  hasChange?: boolean;
  formatValue?: (value: unknown) => string | number;
}

const itemsConfig: Array<ConfigItem> = [
  { key: 'count', labelKey: 'TEXT_CALL_COUNT', tooltipKey: 'TEXT_CALL_COUNT_TOOLTIP' },
  {
    key: 'averageSentiment',
    labelKey: 'TEXT_CUSTOMER_ENGAGEMENT',
    tooltipKey: 'TEXT_CUSTOMER_ENGAGEMENT_TOOLTIP',
    formatValue: (value) => `${Number(value).toFixed(1)}/5`,
  },
  {
    key: 'averageDuration',
    labelKey: 'TEXT_CALL_DURATION',
    tooltipKey: 'TEXT_CALL_DURATION_TOOLTIP',
    formatValue: (value) => formatDuration(Duration.fromObject({ seconds: Number(value) })),
  },
  {
    key: 'mostPopularTopic',
    labelKey: 'TEXT_MOST_POPULAR_TOPIC',
    hasChange: false,
    tooltipKey: 'TEXT_MOST_POPULAR_TOPIC_TOOLTIP',
  },
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
        ({ key, labelKey, hasChange = true, tooltipKey, formatValue }, index, arr) =>
          general[key] && {
            title: t(labelKey),
            change: hasChange ? general[key]?.change : undefined,
            value: formatValue ? formatValue(general[key].currentMeasurement) : general[key].currentMeasurement,
            date: currentMonth,
            tooltipProps: {
              content: t(tooltipKey),
              placement: (index === arr.length - 1 ? 'bottom-end' : 'right') as TooltipProps['placement'],
            },
          },
      ),
    );

  console.log('t:', t('TEXT_CALL_COUNT_TOOLTIP'));

  return (
    <div className='flex flex-row gap-2'>
      {statisticsItems?.map((itemProps) => <StatisticsItem key={itemProps.title} {...itemProps} />)}
    </div>
  );
}
