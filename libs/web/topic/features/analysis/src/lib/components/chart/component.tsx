'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { type ReactElement, Fragment, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { Legend } from '@tellme/web/topic/ui/legend';
import styles from './component.module.scss';

// TODO: Remove any and replace with actual data types
interface TopicChartProps {
  chart: {
    data: Array<{ date: string; count: number; averageSentiment: number }>;
    period: TrendPeriod;
  };
}

const renderYAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <text
      x={x}
      y={y}
      dx={-5}
      dy={5}
      textAnchor='end'
      style={{ fontSize: 12, fill: 'currentColor' }}>
      {payload.value}
    </text>
  );
};

function TopicChartComponent({ chart }: TopicChartProps): ReactElement {
  const t = useTranslations('topic.ANALYSIS.CHART');
  const { data, period } = chart;

  const tickFormatter = (tick: string): string => {
    const dt = DateTime.fromISO(tick);

    if (period === TrendPeriod.MONTHLY) {
      return dt.toFormat('MMM');
    } else if (period === TrendPeriod.WEEKLY) {
      const weekEnd = dt.plus({ days: 6 });

      return `${dt.toFormat('d')}-${weekEnd.toFormat('d LLL')}`;
    } else if (period === TrendPeriod.DAILY) {
      return dt.toFormat('d MMM');
    }

    return '';
  };

  const lines = [
    { key: 'count', color: styles.brandPrimary, label: t('TEXT_FREQUENCY'), style: { transform: 'translateY(-2px)' } },
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
        height={280}
        className='min-h-[280px]'>
        <LineChart data={data} margin={{ left: -60, right: 20 }}>
          <CartesianGrid
            stroke='currentColor'
            className='text-text-tertiary'
            vertical={false} />
          <XAxis
            tick={{ fontSize: 14, fill: 'currentColor' }}
            className='text-text-secondary'
            dataKey='date'
            interval={0}
            minTickGap={0}
            tickFormatter={tickFormatter}
            tickLine={false}
            allowDecimals={false}
            tickMargin={5}
            textAnchor='middle'
          />
          <YAxis
            tick={renderYAxisTick}
            width={80}
            className='text-text-secondary'
            tickMargin={0}
            allowDecimals={false}
            tickLine={false}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type='monotone'
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              style={line.style}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
}

export const TopicChart = memo(TopicChartComponent);
