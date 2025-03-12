'use client';

import { type ReactElement } from 'react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFilters } from '@tellme/web/topic/ui/date-time-filters';
import { TopicSelect } from '@tellme/web/topic/ui/select';
import { topicsMock, graphDataMock, paragraphsMock, filtersMock } from './mocks/analysis';

export function TopicAnalysis(): ReactElement {
  const showUnderDevelopment = useShowUnderDevelopment();
  const [selectedValue, setSelectedValue] = useState(topicsMock[0].value);

  const selectedItem = topicsMock.find((item) => item.value === selectedValue);

  const handleTopicSelect = (value: string): void => {
    setSelectedValue(value);
    showUnderDevelopment();
  };

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title='Topic Analysis' />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row items-start justify-between'>
          <div className='flex flex-row gap-5 items-center'>
            <Heading level={2} className='text-3xl'>
              {selectedItem?.label}
            </Heading>
            <TopicSelect
              items={topicsMock}
              selectedValue={selectedValue}
              onSelect={handleTopicSelect} />
          </div>
          <div>
            <DateTimeFilters options={filtersMock} onChange={showUnderDevelopment} />
          </div>
        </div>
        <div className='flex flex-row justify-between items-center mt-4 mb-2'>
          <Heading level={3} className='text-xl uppercase'>
            Trends
          </Heading>
          <div className='flex flex-row gap-4 items-center'>
            <p className='relative flex items-center gap-[10px]'>
              <span className='w-3 h-3 bg-brand-primary rounded-full' />
              Frequency
            </p>
            <p className='relative flex items-center gap-[10px]'>
              <span className='w-3 h-3 bg-brand-tertiary rounded-full' />
              Customer engagement
            </p>
          </div>
        </div>
        <ResponsiveContainer
          width='100%'
          height='100%'
          className='min-h-[280px]'>
          <LineChart data={graphDataMock} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
            <CartesianGrid
              stroke='currentColor'
              className='text-text-tertiary'
              vertical={false} />
            <XAxis
              tick={{ fontSize: 14, fill: 'currentColor' }}
              className='text-text-secondary'
              dataKey='name'
              interval='preserveStartEnd'
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className='text-text-secondary'
              domain={[0, 100]}
              tickMargin={0}
              tickLine={false}
            />
            <Line
              type='monotone'
              dataKey='frequency'
              stroke='currentColor'
              className='text-brand-primary'
              strokeWidth={2}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='engagement'
              stroke='currentColor'
              className='text-brand-tertiary'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className='flex flex-col gap-3 p-5 bg-background-primary rounded-lg '>
          <Heading level={3} className='text-xl'>
            Reasons for Calling
          </Heading>
          <p>
            Customers frequently contact the call center to inquire about restock dates and availability of specific
            clothing items.
          </p>
        </div>
        <div className='flex flex-col gap-3 p-5 bg-background-primary rounded-lg '>
          <Heading level={3} className='text-xl'>
            Suggested Actions
          </Heading>
          <p>
            The company could improve customer satisfaction by providing more proactive updates on restock timelines and
            enhancing the notification system for customers.
          </p>
        </div>
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
