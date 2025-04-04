'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SummaryDetail, TrendPeriod, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { ChartState } from '../../interfaces/chart-state';
import { generateTimeline, transformChartData } from '../../utils/';

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

interface UseTopicAnalysisProps {
  topicId: string | null;
}

export function useTopicAnalysis({ topicId }: UseTopicAnalysisProps): TopicAnalysisResult {
  const profile = useSelector(authSelectors.profile);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(TrendPeriod.MONTHLY);
  const [chartState, setChartState] = useState<ChartState>({
    data: [],
    period: TrendPeriod.MONTHLY,
  });

  const {
    data: topicList,
    isLoading: isTopicListLoading,
    isUninitialized: isTopicListUninitialized,
  } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });

  const {
    data: { summary } = {},
    isLoading: isSummaryLoading,
    isUninitialized: isSummaryUninitialized,
  } = topicApi.useGetSummaryQuery({ id: Number(selectedTopicId) }, { skip: !selectedTopicId });

  const {
    data: rawChartData,
    isFetching,
    isLoading: isChartDataLoading,
    isUninitialized: isChartDataUninitialized,
  } = topicApi.useGetChartDataQuery(
    { id: Number(selectedTopicId), params: { trendPeriod: selectedPeriod } },
    { skip: !selectedTopicId },
  );

  const isUninitialized = isTopicListUninitialized || isSummaryUninitialized || isChartDataUninitialized;
  const isResourceLoading = isTopicListLoading || isSummaryLoading || isChartDataLoading;
  const isLoading = isResourceLoading || isUninitialized;

  const isEmptyList = topicList?.results?.length === 0;
  const isEmptyChart = summary?.length === 0 && rawChartData?.length === 0;

  const timeline = useMemo(() => generateTimeline(selectedPeriod), [selectedPeriod]);

  const chartData = useMemo(() => {
    if (!rawChartData) {
      return [];
    }

    return transformChartData(rawChartData, timeline);
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
    const availableIds = topicList?.results.map((topic) => String(topic.id)) || [];

    const isSelectedIdValid = selectedTopicId && availableIds.includes(selectedTopicId);
    const isTopicFromUrlValid = topicId && availableIds.includes(topicId);

    if (isSelectedIdValid) {
      return;
    }

    if (isTopicFromUrlValid) {
      setSelectedTopicId(topicId);

      return;
    }

    if (availableIds.length > 0) {
      setSelectedTopicId(availableIds[0]);
    }
  }, [selectedTopicId, topicId, topicList?.results]);

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
