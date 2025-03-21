'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { Legend } from '@tellme/web/topic/ui/legend';
import styles from './component.module.scss';

// TODO: Remove any and replace with actual data types
interface TopicChartProps {
  data: any;
}

export function TopicChart({ data }: TopicChartProps): ReactElement {
  const t = useTranslations('topic.ANALYSIS.CHART');

  const lines = [
    { key: 'count', color: styles.brandPrimary, label: t('TEXT_FREQUENCY') },
    { key: 'averageSentiment', color: styles.brandTertiary, label: t('TEXT_CUSTOMER_ENGAGEMENT') },
  ];

  return (
    <Fragment>
      <div className='flex flex-row justify-between items-center mt-4 mb-2'>
        <Heading level={3} className='text-xl uppercase'>
          {t('TEXT_TRENDS')}
        </Heading>
        <div className='flex flex-row gap-4 items-center'>
          {lines.map(({ key, ...props }) => (
            <Legend key={key} {...props} />
          ))}
        </div>
      </div>
      <ResponsiveContainer
        width='100%'
        height='100%'
        className='min-h-[280px]'>
        <LineChart data={data} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
          <CartesianGrid
            stroke='currentColor'
            className='text-text-tertiary'
            vertical={false} />
          <XAxis
            tick={{ fontSize: 14, fill: 'currentColor' }}
            className='text-text-secondary'
            dataKey='date'
            interval='preserveStartEnd'
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className='text-text-secondary'
            tickMargin={0}
            tickLine={false}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type='monotone'
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
}
