'use client';

import { type ReactElement } from 'react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFilters } from '@tellme/web/topic/ui/date-time-filters';
import { TopicSelect } from '@tellme/web/topic/ui/select';

const topics = [
  { value: 'product-stock', label: 'Product Stock' },
  { value: 'order-status', label: 'Order Status' },
  { value: 'returns', label: 'Returns and Exchanges' },
  { value: 'sizing', label: 'Sizing and Fit' },
  { value: 'promotions', label: 'Promotions' },
];

const filters = [
  { label: '1 year', value: 'daily' },
  { label: '3 months', value: 'weekly' },
  { label: '1 month', value: 'monthly' },
];

const data = [
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const paragraphs = [
  {
    title: 'Stages of the Customer Journey',
    text: 'These callers are predominantly found in the consideration stage, as they are seeking information before making a purchase decision.',
  },
  {
    title: 'Call Resolution Rates',
    text: 'Most inquiries are resolved during the initial call, as agents provide information about restock timelines or set up notifications.',
  },
  {
    title: 'Churn Potential',
    text: 'The potential for churn appears low, as customers are actively seeking information to make purchases, indicating ongoing interest in the brand.',
  },
  {
    title: 'Causes for Dissatisfaction',
    text: 'Dissatisfaction may arise from delays in restocking or unavailability of desired items, but this is not explicitly mentioned in the conversations.',
  },
  {
    title: 'Causes for Engagement',
    text: 'Engagement is fostered through timely and informative responses from agents, as well as the option for restock notifications.',
  },
];

export function TopicAnalysis(): ReactElement {
  const [selectedValue, setSelectedValue] = useState(topics[0].value);

  const selectedItem = topics.find((item) => item.value === selectedValue);

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
              items={topics}
              selectedValue={selectedValue}
              onSelect={setSelectedValue} />
          </div>
          <div>
            <DateTimeFilters
              options={filters}
              defaultValue='1y'
              onChange={(value) => console.log('Selected:', value)}
            />
          </div>
        </div>
        <div className='flex flex-row justify-between items-center mt-4 mb-2'>
          <Heading level={3} className='text-xl uppercase'>
            Trends
          </Heading>
          <div className='flex flex-row gap-4 items-center'>
            <p className='relative flex items-center gap-[10px] s'>
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='0' vertical={false} />
            <XAxis tickLine={false} />
            <YAxis tickLine={false} />
            <Line
              type='monotone'
              dataKey='amt'
              stroke='currentColor'
              className='text-brand-primary'
              strokeWidth={2}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='uv'
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
        <div className='grid grid-cols-2 gap-10 bg-white rounded-lg mt-2'>
          {paragraphs.map((item, index) => (
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
