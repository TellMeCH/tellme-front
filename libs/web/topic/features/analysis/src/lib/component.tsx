'use client';

import { type ReactElement } from 'react';
import { useState } from 'react';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { TopicSelect } from '@tellme/web/topic/ui/select';

const topics = [
  { value: 'product-stock', label: 'Product Stock' },
  { value: 'order-status', label: 'Order Status' },
  { value: 'returns', label: 'Returns and Exchanges' },
  { value: 'sizing', label: 'Sizing and Fit' },
  { value: 'promotions', label: 'Promotions' },
];

export function TopicAnalysis(): ReactElement {
  const [selectedValue, setSelectedValue] = useState(topics[0].value);

  const selectedItem = topics.find((item) => item.value === selectedValue);

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title='Topic Analysis' />
      <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row gap-5 items-center'>
          <Heading level={2} className='text-3xl'>
            {selectedItem?.label}
          </Heading>
          <TopicSelect
            items={topics}
            selectedValue={selectedValue}
            onSelect={setSelectedValue} />
        </div>
      </div>
    </div>
  );
}
