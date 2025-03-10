'use client';

import { type ReactElement } from 'react';
import { useState } from 'react';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFilter } from '@tellme/web/topic/ui/date-time-filter';
import { TopicSelect } from '@tellme/web/topic/ui/select';

const topics = [
  { value: 'product-stock', label: 'Product Stock' },
  { value: 'order-status', label: 'Order Status' },
  { value: 'returns', label: 'Returns and Exchanges' },
  { value: 'sizing', label: 'Sizing and Fit' },
  { value: 'promotions', label: 'Promotions' },
];

const filters = [
  { label: '1 year', value: '1y' },
  { label: '3 months', value: '3m' },
  { label: '1 month', value: '1m' },
];

export function TopicAnalysis(): ReactElement {
  const [selectedValue, setSelectedValue] = useState(topics[0].value);

  const selectedItem = topics.find((item) => item.value === selectedValue);

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title='Topic Analysis' />
      <div className='flex-1 flex flex-row items-start justify-between  bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row gap-5 items-center'>
          <Heading level={2} className='text-3xl'>
            {selectedItem?.label}
          </Heading>
          <TopicSelect
            items={topics}
            selectedValue={selectedValue}
            onSelect={setSelectedValue} />
        </div>
        <div>
          <DateTimeFilter
            options={filters}
            defaultValue='1y'
            onChange={(value) => console.log('Selected:', value)} />
        </div>
      </div>
    </div>
  );
}
