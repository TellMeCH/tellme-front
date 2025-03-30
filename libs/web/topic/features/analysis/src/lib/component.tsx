'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { TrendPeriod, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { TopicSelect, PeriodFilter, CardSection, TopicChart } from './components';
import { ChartState } from './interfaces/chart-state';
import { generateTimeline } from './utils/generate-timeline';

export function TopicAnalysis(): ReactElement {
  const t = useTranslations('topic.ANALYSIS');
  const profile = useSelector(authSelectors.profile);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(TrendPeriod.MONTHLY);
  const [chartState, setChartState] = useState<ChartState>({
    data: [],
    period: TrendPeriod.MONTHLY,
  });

  const { data: topicList } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });
  const { data: { summary } = {}, isLoading } = topicApi.useGetSummaryDataQuery(
    { id: Number(selectedTopicId) },
    { skip: !selectedTopicId },
  );
  const { data: rawChartData, isFetching } = topicApi.useGetChartDataQuery(
    { id: Number(selectedTopicId), trendPeriod: selectedPeriod },
    { skip: !selectedTopicId },
  );

  const timeline = useMemo(() => generateTimeline(selectedPeriod).timeline, [selectedPeriod]);

  const chartData = useMemo(() => {
    if (!rawChartData) {
      return [];
    }

    return timeline.map((bucket) => {
      const items = rawChartData.filter((item) => item.date >= bucket.start && item.date < bucket.end);
      const count = items.reduce((acc, item) => acc + Number(item.count), 0);
      const averageSentiment = items.length
        ? items.reduce((acc, item) => acc + Number(item.averageSentiment), 0) / items.length
        : 0;

      return { date: bucket.start.toISO() as string, count, averageSentiment };
    });
  }, [rawChartData, timeline]);

  const topicOptions =
    topicList?.results?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  const selectedTopic = topicOptions.find((item) => item.value === selectedTopicId);

  const periodOptions = Object.values(TrendPeriod).map((value) => ({
    value,
    label: t(`DATE_PERIOD.TEXT_${value.toUpperCase()}`),
  }));

  const handleTopicChange = (value: string): void => {
    if (value === selectedTopicId) {
      return;
    }

    setSelectedTopicId(value);
  };

  const handlePeriodChange = (value: TrendPeriod): void => {
    if (value === selectedPeriod) {
      return;
    }

    setSelectedPeriod(value);
  };

  useEffect(() => {
    if (!selectedTopicId && topicList?.results && topicList?.results.length > 0) {
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

  const specialSections = ['reasonsForCalling', 'suggestedActions'];

  const highlightedSections = summary?.filter((item) => specialSections.includes(item.key));
  const generalSections = summary?.filter((item) => !specialSections.includes(item.key));

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={t('TEXT_TOPIC_ANALYSIS')} />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row items-start justify-between'>
          <div className='flex flex-row gap-5 items-center'>
            <Heading level={2} className='text-3xl'>
              {selectedTopic?.label}
            </Heading>
            <TopicSelect
              items={topicOptions}
              selectedValue={selectedTopicId}
              onSelect={handleTopicChange} />
          </div>
          <div>
            <PeriodFilter options={periodOptions} onChange={handlePeriodChange} />
          </div>
        </div>
        {chartState.data.length > 0 && <TopicChart chart={chartState} />}
        {highlightedSections?.map(({ key, name, description }) => (
          <CardSection key={key} title={name}>
            <p>{description}</p>
          </CardSection>
        ))}
        <div className='grid grid-cols-2 gap-10 rounded-lg mt-2'>
          {generalSections?.map(({ key, name, description }) => (
            <div key={key}>
              <p className='font-medium text-xl mb-2'>{name}</p>
              <p className='text-gray-600 whitespace-normal text-clip'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
