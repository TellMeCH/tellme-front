'use client';

import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  organizationApi,
  Topic,
  TopicMetric,
  PaginationResponse,
  useSearchTopics,
} from '@tellme/web/shared/data-access/api';
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
  const profile = useSelector(authSelectors.profile);

  const { data, fetchNextPage } = useSearchTopics({
    params: { isActive: true, pageSize: 10 },
    skip: !profile,
  });
  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery(undefined, { skip: !profile });

  const { firstDate, secondDate, topicMetrics } = topicOverview || {};

  const { activeTopics, maxCount } = useMemo(() => {
    if (!data?.results || !topicMetrics) {
      return { activeTopics: [], maxCount: 0 };
    }
    const activeTopicMap = new Map(data.results.map((topic: Topic) => [topic.name, topic]));

    const filteredTopics = topicMetrics
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
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
