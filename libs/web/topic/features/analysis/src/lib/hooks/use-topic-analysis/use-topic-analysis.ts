'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SummaryDetail, TopicListType, TrendPeriod, topicApi } from '@tellme/web/shared/data-access/api';
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
  handleTopicChange: (value: string) => void;
  handlePeriodChange: (value: TrendPeriod) => void;
  selectedTopic?: TopicOption;
  summary?: Array<SummaryDetail>;
}

interface UseTopicAnalysisProps {
  topicKey: string | null;
}

export function useTopicAnalysis({ topicKey }: UseTopicAnalysisProps): TopicAnalysisResult {
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
  } = topicApi.useSearchQuery({ listType: TopicListType.RECENT }, { skip: !profile });

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

  const isEmptyList = topicList?.results?.length === 0;

  const isListLoading = isTopicListUninitialized || isTopicListLoading;

  const areDetailsLoading =
    !isEmptyList && (isSummaryLoading || isChartDataLoading || isSummaryUninitialized || isChartDataUninitialized);

  const isLoading = isListLoading || areDetailsLoading;

  const timeline = useMemo(() => generateTimeline(selectedPeriod), [selectedPeriod]);

  const chartData = useMemo(() => {
    if (!rawChartData) {
      return [];
    }

    return transformChartData(rawChartData, timeline);
  }, [rawChartData, timeline]);

  const topicOptions =
    topicList?.results?.map((item) => ({
      value: String(item.idFromUrl),
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
    const availableTopics = topicList?.results || [];
    const availableIds = availableTopics.map((topic) => String(topic.idFromUrl));

    const isSelectedIdValid = selectedTopicId && availableIds.includes(selectedTopicId);

    if (isSelectedIdValid) {
      return;
    }

    if (topicKey) {
      const matchedTopic = availableTopics.find(
        (topic) => String(topic.idFromUrl) === topicKey || topic.name === topicKey,
      );

      if (matchedTopic) {
        setSelectedTopicId(String(matchedTopic.idFromUrl));

        return;
      }
    }

    if (availableTopics.length > 0) {
      setSelectedTopicId(String(availableTopics[0].idFromUrl));
    }
  }, [selectedTopicId, topicKey, topicList?.results]);

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
    handleTopicChange,
    handlePeriodChange,
  };
}
