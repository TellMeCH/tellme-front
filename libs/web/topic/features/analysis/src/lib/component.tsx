'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { TopicSelect, PeriodFilter, CardSection, TopicChart, EmptyChart } from './components';
import { useTopicAnalysis } from './hooks';

export function TopicAnalysis(): ReactElement {
  const t = useTranslations('topic.ANALYSIS');

  const {
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
  } = useTopicAnalysis();

  const periodOptions = Object.values(TrendPeriod).map((value) => ({
    value,
    label: t(`DATE_PERIOD.TEXT_${value.toUpperCase()}`),
  }));

  const specialSections = ['reasonsForCalling', 'suggestedActions'];
  const highlightedSections = summary?.filter((item) => specialSections.includes(item.key));
  const generalSections = summary?.filter((item) => !specialSections.includes(item.key));

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={t('TEXT_TOPIC_ANALYSIS')} />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Spinner />
          </div>
        ) : isEmptyList ? (
          <EmptyChart />
        ) : (
          <Fragment>
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

              {!isEmptyChart && <PeriodFilter options={periodOptions} onChange={handlePeriodChange} />}
            </div>

            {isEmptyChart ? (
              <EmptyChart />
            ) : (
              <Fragment>
                <TopicChart chart={chartState} />

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
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}
