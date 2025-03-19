'use client';

import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { topicApi, organizationApi, Topic, TopicMetric, PaginationResponse } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

interface UseTopicTrendsReturn {
  data?: PaginationResponse<Topic>;
  firstDate?: DateTime;
  secondDate?: DateTime;
  activeTopics: Array<TopicMetric & { description: string }>;
  maxCount: number;
  fetchNextPage: () => void;
}

export function useTopicTrends(): UseTopicTrendsReturn {
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const profile = useSelector(authSelectors.profile);

  const { data, isFetching } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });
  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery(undefined, { skip: !profile });

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(topicApi.endpoints.searchInfinite.initiate({ cursor: data.nextCursor }, { forceRefetch: true }));
    }
  };

  const { firstDate, secondDate, topicMetrics } = topicOverview || {};

  const { activeTopics, maxCount } = useMemo(() => {
    if (!data?.results || !topicMetrics) {
      return { activeTopics: [], maxCount: 0 };
    }
    const activeTopicMap = new Map(data.results.map((topic) => [topic.name, topic]));

    const filteredTopics = topicMetrics
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((metric) => activeTopicMap.has(metric.name))
      .map((metric) => ({
        ...metric,
        description: activeTopicMap.get(metric.name)?.description || '',
      }));

    const maxCount = Math.max(
      ...filteredTopics.flatMap(({ count: { firstMeasurement, secondMeasurement } }) => [
        Number(firstMeasurement),
        Number(secondMeasurement),
      ]),
    );

    return { activeTopics: filteredTopics, maxCount };
  }, [data, topicMetrics]);

  return {
    data,
    firstDate,
    secondDate,
    activeTopics,
    maxCount,
    fetchNextPage,
  };
}
