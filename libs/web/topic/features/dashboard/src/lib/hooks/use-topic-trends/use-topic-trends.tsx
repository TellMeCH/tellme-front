'use client';

import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, TopicMetric, topicApi, TopicSummary } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

interface UseTopicTrendsReturn {
  currentMonth?: DateTime;
  previousMonth?: DateTime;
  activeTopics: Array<TopicMetric & { topicKey: string; description: string }>;
  maxCount: number;
}

export function useTopicTrends(): UseTopicTrendsReturn {
  const profile = useSelector(authSelectors.profile);

  const { data: topicOverview } = organizationApi.useGetTopicsOverviewQuery(undefined, { skip: !profile });
  const { data: summaries } = topicApi.useGetAllSummariesQuery(undefined, {
    skip: !profile,
  });

  const { currentMonth, previousMonth, topicMetrics } = topicOverview || {};

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
        topicKey: String(topicSummary?.topicId ?? metric.name),
        description: reasonsForCalling || '',
      };
    });

    const maxCount = Math.max(
      ...filteredTopics.flatMap(({ count: { currentMeasurement, previousMeasurement } }) => [
        Number(currentMeasurement),
        Number(previousMeasurement),
      ]),
    );

    return { activeTopics: filteredTopics, maxCount };
  }, [summaries, topicMetrics]);

  return {
    currentMonth,
    previousMonth,
    activeTopics,
    maxCount,
  };
}
