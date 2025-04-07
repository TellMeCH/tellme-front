'use client';

import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, TopicMetric, topicApi, TopicSummary } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

interface UseTopicTrendsReturn {
  firstDate?: DateTime;
  secondDate?: DateTime;
  activeTopics: Array<TopicMetric & { id: string; description: string }>;
  maxCount: number;
}

export function useTopicTrends(): UseTopicTrendsReturn {
  const profile = useSelector(authSelectors.profile);

  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery(undefined, { skip: !profile });
  const { data: summaries } = topicApi.useGetAllSummariesQuery(undefined, { skip: !profile });

  const { firstDate, secondDate, topicMetrics } = topicOverview || {};

  const { activeTopics, maxCount } = useMemo(() => {
    if (!topicMetrics || !summaries) {
      return { activeTopics: [], maxCount: 0 };
    }

    const summaryMap = new Map(summaries.map((summary: TopicSummary) => [summary.topicName, summary]));

    const filteredTopics = topicMetrics.map((metric) => {
      const topicSummary = summaryMap.get(metric.name);
      const reasonsForCalling = topicSummary?.summary.find((item) => item.key === 'reasonsForCalling')?.description;

      return {
        ...metric,
        id: String(topicSummary?.topicId ?? metric.name),
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
  }, [summaries, topicMetrics]);

  return {
    firstDate,
    secondDate,
    activeTopics,
    maxCount,
  };
}
