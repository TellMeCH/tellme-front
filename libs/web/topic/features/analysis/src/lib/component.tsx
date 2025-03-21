'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { TrendPeriod, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { TopicSelect, PeriodFilter, CardSection, TopicChart } from './components';

export function TopicAnalysis(): ReactElement {
  const t = useTranslations('topic.ANALYSIS');
  const showUnderDevelopment = useShowUnderDevelopment();
  const profile = useSelector(authSelectors.profile);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [trendPeriod, setTrendPeriod] = useState(TrendPeriod.MONTHLY);

  const { data } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });
  const { data: { summary } = {}, isFetching } = topicApi.useGetSummaryDataQuery(
    { id: Number(selectedValue) },
    { skip: !selectedValue },
  );

  const { data: chart } = topicApi.useGetChartDataQuery(
    { id: Number(selectedValue), trendPeriod },
    { skip: !selectedValue },
  );

  const chartData = useMemo(() => {
    if (!chart) {
      return;
    }

    return [...chart]
      .sort((a, b) => a.date.toMillis() - b.date.toMillis())
      .map((item) => ({
        ...item,
        date: item.date.toFormat('MMM dd, yyyy'),
      }));
  }, [chart, data]);

  console.log(chartData);

  const topics =
    data?.results?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

  const selectedItem = topics.find((item) => item.value === selectedValue);

  const trendPeriodOptions = Object.values(TrendPeriod).map((value) => ({
    value,
    label: t(`DATE_PERIOD.TEXT_${value.toUpperCase()}`),
  }));

  const handleTopicSelect = (value: string): void => {
    if (value === selectedValue) {
      return;
    }

    setSelectedValue(value);
  };

  const handlePeriodSelect = (value: TrendPeriod): void => {
    if (value === selectedValue) {
      return;
    }

    setTrendPeriod(value);
  };

  const specialSections = ['reasonsForCalling', 'suggestedActions'];

  const highlightedSections = summary?.filter((item) => specialSections.includes(item.key));
  const generalSections = summary?.filter((item) => !specialSections.includes(item.key));

  useEffect(() => {
    if (!selectedValue && topics.length > 0) {
      setSelectedValue(topics[0].value);
    }
  }, [topics]);

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={t('TEXT_TOPIC_ANALYSIS')} />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row items-start justify-between'>
          <div className='flex flex-row gap-5 items-center'>
            <Heading level={2} className='text-3xl'>
              {selectedItem?.label}
            </Heading>
            <TopicSelect
              items={topics}
              selectedValue={selectedValue}
              onSelect={handleTopicSelect} />
          </div>
          <div>
            <PeriodFilter options={trendPeriodOptions} onChange={handlePeriodSelect} />
          </div>
        </div>
        {chartData && <TopicChart data={chartData} />}
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
