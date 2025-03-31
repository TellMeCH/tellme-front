'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement, Fragment, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { Legend } from '@tellme/web/topic/ui/legend';
import { ChartState } from '../../interfaces/chart-state';
import { formatTick } from '../../utils';
import styles from './component.module.scss';

interface TopicChartProps {
  chart: ChartState;
}

function TopicChartComponent({ chart }: TopicChartProps): ReactElement {
  const t = useTranslations('topic.ANALYSIS.CHART');
  const { data, period } = chart;

  const lines = [
    { key: 'count', color: styles.brandPrimary, label: t('TEXT_FREQUENCY'), style: { transform: 'translateY(-2px)' } },
    { key: 'averageSentiment', color: styles.brandTertiary, label: t('TEXT_CUSTOMER_ENGAGEMENT') },
  ];

  const tickFormatter = (isoString: string): string => formatTick(isoString, period);

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
        <LineChart data={data} margin={{ left: -40, right: 20 }}>
          <CartesianGrid
            stroke='currentColor'
            className='text-text-tertiary'
            vertical={false} />
          <XAxis
            tickFormatter={tickFormatter}
            tick={{ fontSize: 14, fill: 'currentColor' }}
            className='text-text-secondary'
            dataKey='date'
            tickLine={false}
            allowDecimals={false}
            textAnchor='middle'
          />
          <YAxis
            dy={-5}
            dataKey={lines[1].key}
            textAnchor='end'
            style={{ fontSize: 11, fill: 'currentColor' }}
            className='text-text-secondary'
            tickMargin={0}
            allowDecimals={false}
            tickLine={false}
          />
          <YAxis
            dataKey={lines[0].key}
            yAxisId='right'
            orientation='right'
            allowDecimals={false}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            //axisLine={false}
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
