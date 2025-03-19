'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { TopicSelect, PeriodFilter, CardSection, TopicChart } from './components';
import { graphDataMock, paragraphsMock, filtersMock } from './mocks/analysis';

export function TopicAnalysis(): ReactElement {
  const t = useTranslations('topic.ANALYSIS');
  const showUnderDevelopment = useShowUnderDevelopment();
  const profile = useSelector(authSelectors.profile);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const { data, isLoading } = topicApi.useSearchInfiniteQuery({ isActive: true }, { skip: !profile });

  const topics =
    data?.results?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

  useEffect(() => {
    if (!selectedValue && topics.length > 0) {
      setSelectedValue(topics[0].value);
    }
     
  }, [topics]);

  const selectedItem = topics.find((item) => item.value === selectedValue);

  const handleTopicSelect = (value: string): void => {
    if (value === selectedValue) {
      return;
    }

    setSelectedValue(value);
    showUnderDevelopment();
  };

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
            <PeriodFilter options={filtersMock} onChange={showUnderDevelopment} />
          </div>
        </div>
        <TopicChart data={graphDataMock} />
        <CardSection title={t('TEXT_REASONS_FOR_CALLING')}>
          {/* TODO: Replace this with actual data */}
          <p>
            Customers frequently contact the call center to inquire about restock dates and availability of specific
            clothing items.
          </p>
        </CardSection>
        <CardSection title={t('TEXT_SUGGESTED_ACTIONS')}>
          {/* TODO: Replace this with actual data */}
          <p>
            The company could improve customer satisfaction by providing more proactive updates on restock timelines and
            enhancing the notification system for customers.
          </p>
        </CardSection>
        <div className='grid grid-cols-2 gap-10 rounded-lg mt-2'>
          {paragraphsMock.map((item, index) => (
            <div key={index}>
              <p className='font-medium text-xl mb-2'>{item.title}</p>
              <p className='text-gray-600 whitespace-normal text-clip'>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
