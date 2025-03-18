'use client';

import { Spinner } from '@heroui/react';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { type ReactElement, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { Legend } from '@tellme/web/topic/ui/legend';
import { TopicTrendsItem } from '../topic-trends-item';
import styles from './component.module.scss';

export function DashboardTopicTrends(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS');
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const profile = useSelector(authSelectors.profile);
  const { data, isFetching } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });
  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery({}, { skip: !profile });

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(topicApi.endpoints.searchInfinite.initiate({ cursor: data.nextCursor }, { forceRefetch: true }));
    }
  };

  const { firstDate, secondDate, topicMetrics } = topicOverview || {};

  const { activeTopics, maxProgressValue } = useMemo(() => {
    if (!data?.results || !topicMetrics) {
      return { activeTopics: [], maxProgressValue: 0 };
    }

    const activeTopicMap = new Map(data.results.map((topic) => [topic.name, topic]));

    const filteredTopics = topicMetrics
      .filter((metric) => activeTopicMap.has(metric.name))
      .map((metric) => ({
        ...metric,
        description: activeTopicMap.get(metric.name)?.description || '',
      }));

    const maxValue = Math.max(
      ...filteredTopics.flatMap(({ count: { firstMeasurement, secondMeasurement } }) => [
        Number(firstMeasurement),
        Number(secondMeasurement),
      ]),
    );

    return { activeTopics: filteredTopics, maxProgressValue: maxValue };
  }, [data, topicMetrics]);

  return (
    <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
      <div className='flex flex-row justify-between items-start'>
        <Heading level={2} className={styles['topic-trends__title']}>
          {t('TEXT_TOPIC_TRENDS')}
        </Heading>
        {firstDate && secondDate && (
          <div className='flex flex-row gap-4 items-center'>
            <Legend label={formatDate(secondDate, DateTimeFormat.MONTH_ONLY)} color={styles.controlPrimary} />
            <Legend label={formatDate(firstDate, DateTimeFormat.MONTH_ONLY)} color={styles.controlSecondary} />
          </div>
        )}
      </div>
      <div>
        <InfiniteScroll
          className={styles['topic-trends__list']}
          dataLength={data?.results.length || 0}
          next={fetchNextPage}
          hasMore={!!data?.nextCursor}
          loader={<Spinner />}>
          {activeTopics &&
            activeTopics.map((itemProps) => (
              <TopicTrendsItem
                key={itemProps.name}
                maxProgressValue={maxProgressValue}
                {...itemProps} />
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
