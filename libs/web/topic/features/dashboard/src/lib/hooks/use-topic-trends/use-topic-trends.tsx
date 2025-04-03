'use client';

import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  organizationApi,
  Topic,
  TopicMetric,
  PaginationResponse,
  topicApi,
  TopicSummary,
  useSearchInfiniteTopics,
} from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

interface UseTopicTrendsReturn {
  data?: PaginationResponse<Topic>;
  firstDate?: DateTime;
  secondDate?: DateTime;
  activeTopics: Array<TopicMetric & { id: string; description: string }>;
  maxCount: number;
  fetchNextPage: () => void;
}

export function useTopicTrends(): UseTopicTrendsReturn {
  const profile = useSelector(authSelectors.profile);

  const { data, fetchNextPage } = useSearchInfiniteTopics({
    params: { isActive: true, pageSize: 10 },
    skip: !profile,
  });
  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery(undefined, { skip: !profile });
  const { data: summaries } = topicApi.useGetAllSummariesQuery(undefined, { skip: !profile });

  const { firstDate, secondDate, topicMetrics } = topicOverview || {};

  const { activeTopics, maxCount } = useMemo(() => {
    if (!data?.results || !topicMetrics || !summaries) {
      return { activeTopics: [], maxCount: 0 };
    }
    const activeTopicMap = new Map(data.results.map((topic: Topic) => [topic.name, topic]));
    const summaryMap = new Map(summaries.map((summary: TopicSummary) => [summary.name, summary]));

    const filteredTopics = topicMetrics
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .filter((metric) => activeTopicMap.has(metric.name))
      .map((metric) => {
        const topic = activeTopicMap.get(metric.name);
        const topicSummary = summaryMap.get(metric.name);
        const reasonsForCalling = topicSummary?.summary.find((item) => item.key === 'reasonsForCalling')?.description;

        return {
          ...metric,
          id: String(topic?.id),
          description: reasonsForCalling || '',
        };
      });

    const maxCount = Math.max(
      ...filteredTopics.flatMap(({ count: { firstMeasurement, secondMeasurement } }) => [
        Number(firstMeasurement),
        Number(secondMeasurement),
      ]),
    );

    return { activeTopics: filteredTopics, maxCount };
  }, [data, summaries, topicMetrics]);

  return {
    data,
    firstDate,
    secondDate,
    activeTopics,
    maxCount,
    fetchNextPage,
  };
}
