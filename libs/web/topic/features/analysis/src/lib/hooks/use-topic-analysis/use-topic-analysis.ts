'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SummaryDetail, TrendPeriod, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { ChartState } from '../../interfaces/chart-state';
import { TimelineBucket } from '../../utils';
import { generateTimeline } from '../../utils/generate-timeline';

interface TopicOption {
  value: string;
  label: string;
}

interface TopicAnalysisResult {
  topicOptions: Array<TopicOption>;
  chartState: ChartState;
  selectedTopicId: string | null;
  isLoading: boolean;
  isEmptyList: boolean;
  isEmptyChart: boolean;
  handleTopicChange: (value: string) => void;
  handlePeriodChange: (value: TrendPeriod) => void;
  selectedTopic?: TopicOption;
  summary?: Array<SummaryDetail>;
}

export function useTopicAnalysis(): TopicAnalysisResult {
  const profile = useSelector(authSelectors.profile);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(TrendPeriod.MONTHLY);
  const [chartState, setChartState] = useState<ChartState>({
    data: [],
    period: TrendPeriod.MONTHLY,
  });

  const { data: topicList, isLoading: isTopicListLoading } = topicApi.useSearchInfiniteQuery(
    { isActive: true },
    { skip: !profile },
  );

  const { data: { summary } = {}, isLoading: isSummaryLoading } = topicApi.useGetSummaryDataQuery(
    { id: Number(selectedTopicId) },
    { skip: !selectedTopicId },
  );

  const {
    data: rawChartData,
    isFetching,
    isLoading: isChartDataLoading,
  } = topicApi.useGetChartDataQuery(
    { id: Number(selectedTopicId), trendPeriod: selectedPeriod },
    { skip: !selectedTopicId },
  );

  const isLoading = !profile || isTopicListLoading || isChartDataLoading || isSummaryLoading;
  const isEmptyList = topicList?.results?.length === 0;
  const isEmptyChart = summary?.length === 0;

  const timeline = useMemo(() => generateTimeline(selectedPeriod).timeline, [selectedPeriod]);

  const chartData = useMemo(() => {
    if (!rawChartData) {
      return [];
    }

    return timeline.map((bucket: TimelineBucket) => {
      const items = rawChartData.filter((item) => item.date >= bucket.start && item.date < bucket.end);
      const count = items.reduce((acc, item) => acc + Number(item.count), 0);
      const averageSentiment = items.length
        ? items.reduce((acc, item) => acc + Number(item.averageSentiment), 0) / items.length
        : 0;

      return {
        date: bucket.start.toISO() as string,
        count,
        averageSentiment,
      };
    });
  }, [rawChartData, timeline]);

  const topicOptions =
    topicList?.results?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  const selectedTopic = topicOptions.find((item) => item.value === selectedTopicId);

  const handleTopicChange = (value: string): void => {
    if (value !== selectedTopicId) {
      setSelectedTopicId(value);
    }
  };

  const handlePeriodChange = (value: TrendPeriod): void => {
    if (value !== selectedPeriod) {
      setSelectedPeriod(value);
    }
  };

  useEffect(() => {
    if (!selectedTopicId && topicList?.results?.length) {
      setSelectedTopicId(String(topicList.results[0].id));
    }
  }, [topicList?.results, selectedTopicId]);

  useEffect(() => {
    if (!isFetching && chartData.length > 0) {
      setChartState({
        data: chartData,
        period: selectedPeriod,
      });
    }
  }, [isFetching, chartData, selectedPeriod]);

  return {
    topicOptions,
    selectedTopic,
    selectedTopicId,
    summary,
    chartState,
    isLoading,
    isEmptyList,
    isEmptyChart,
    handleTopicChange,
    handlePeriodChange,
  };
}
