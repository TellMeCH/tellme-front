'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Fragment, memo, type ReactElement } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';
import { Heading, IconWithTooltip } from '@tellme/web/shared/ui/ui-kit';
import { useResponsiveLayout } from '@tellme/web/shared/utils/use-responsive-layout';
import { Legend } from '@tellme/web/topic/ui/legend';
import { ChartState } from '../../interfaces/chart-state';
import { formatTick } from '../../utils';

interface TopicChartProps {
  chartState: ChartState;
}

const frequencyColor = '#569ee2';
const sentimentColor = '#ee7016';

function TopicChartComponent({ chartState }: TopicChartProps): ReactElement {
  const t = useTranslations('topic.ANALYSIS.CHART');
  const { isDesktopLarge } = useResponsiveLayout();

  const { data, period } = chartState;

  const lines = [
    {
      key: 'count',
      color: frequencyColor,
      label: t('TEXT_FREQUENCY'),
      legendTooltipLabel: t('TEXT_FREQUENCY_TOOLTIP'),
      lineStyle: { transform: 'translateY(-2px)' },
    },
    {
      key: 'averageSentiment',
      color: sentimentColor,
      label: t('TEXT_CUSTOMER_ENGAGEMENT'),
      legendTooltipLabel: t('TEXT_CUSTOMER_ENGAGEMENT_TOOLTIP'),
      axisProps: {
        domain: [0, 5],
      },
    },
  ];

  const tickInterval = period === TrendPeriod.DAILY && isDesktopLarge ? 1 : 0;
  const tickFormatter = (isoString: string): string => formatTick(isoString, period);

  return (
    <Fragment>
      <Heading level={3} className='uppercase'>
        {t('TEXT_TRENDS')}
      </Heading>
      <div className='flex flex-row justify-between'>
        {lines.map(({ key, legendTooltipLabel, ...props }, index) => {
          const isFlipped = index === lines.length - 1;

          return (
            <div key={key} className={clsx('flex items-center gap-2', isFlipped ? 'flex-row-reverse' : 'flex-row')}>
              <Legend isFlipped={isFlipped} {...props} />
              <IconWithTooltip content={legendTooltipLabel} placement='bottom' />
            </div>
          );
        })}
      </div>
      <ResponsiveContainer
        width='100%'
        height='100%'
        className='min-h-[280px]'>
        <LineChart data={data} margin={{ left: -40, right: -40 }}>
          <CartesianGrid
            stroke='currentColor'
            className='text-text-tertiary'
            vertical={false} />
          <XAxis
            tickFormatter={tickFormatter}
            tick={{ fontSize: 14, fill: 'currentColor' }}
            className='text-text-secondary'
            dataKey='date'
            allowDataOverflow
            scale='point'
            interval={tickInterval}
            tickLine={false}
            allowDecimals={false}
            textAnchor='middle'
          />
          {lines.map((line, index) => (
            <YAxis
              key={line.key}
              yAxisId={line.key}
              orientation={index === 0 ? 'left' : 'right'}
              allowDecimals={false}
              dy={-5}
              style={{ fontSize: 11, fill: line.color }}
              tickLine={false}
              tickCount={6}
              {...line.axisProps}
            />
          ))}
          {lines.map((line) => (
            <Line
              yAxisId={line.key}
              key={line.key}
              type='monotone'
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              style={line.lineStyle}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
}

export const TopicChart = memo(TopicChartComponent);
