'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { CircularProgress, AppProgress, IconWithTooltip } from '@tellme/web/shared/ui/ui-kit';
import { Measurement } from '@tellme/web/shared/utils/class-transformer';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

interface TopicTrendsItemProps {
  topicKey: string;
  name: string;
  description: string;
  maxCount?: number;
  count: Measurement;
  averageSentiment: Measurement;
}

export function TopicTrendsItem({
  topicKey,
  name,
  description,
  count,
  averageSentiment,
  maxCount,
}: TopicTrendsItemProps): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS_ITEM');

  return (
    <div
      data-testid='overview-item'
      className='flex flex-row justify-between min-h-[140px] py-4 gap-[60px] border-b border-text-tertiary last:border-none'>
      <div className='flex flex-col gap-2 w-1/3'>
        <Link
          href={{ pathname: navigationConfig.routes.private.topicAnalysis, query: { topicKey } }}
          className='text-xl hover:underline'>
          {name}
        </Link>
        {!!description && (
          <p data-testid='summary-description' className='text-sm whitespace-pre-wrap'>
            {description}
          </p>
        )}
      </div>
      <div className='flex flex-col flex-1 w-1/3'>
        <div className='flex flex-row gap-2 items-center mb-[22px]'>
          <p className='text-text-secondary'>{t('TEXT_FREQUENCY')}</p>
          <IconWithTooltip content={t('TEXT_FREQUENCY_TOOLTIP')} placement='right' />
        </div>
        <div className='flex flex-col gap-1'>
          <AppProgress
            maxValue={maxCount}
            value={Math.round(Number(count.currentMeasurement))}
            aria-label={t('TEXT_CURRENT_MEASUREMENT_AREA_LABEL')}
          />
          <AppProgress
            maxValue={maxCount}
            value={Math.round(Number(count.previousMeasurement))}
            aria-label={t('TEXT_PREVIOUS_MEASUREMENT_AREA_LABEL')}
            color='secondary'
          />
        </div>
      </div>
      <div className='flex flex-col flex-1 w-1/5 pl-[5%]'>
        <div className='flex flex-row gap-2 items-center mb-2'>
          <p className='text-text-secondary '>{t('TEXT_CUSTOMER_ENGAGEMENT')}</p>
          <IconWithTooltip content={t('TEXT_CUSTOMER_ENGAGEMENT_TOOLTIP')} placement='top-end' />
        </div>
        <div className='flex flex-row gap-[68px]'>
          <CircularProgress value={Math.round(Number(averageSentiment.currentMeasurement))} />
          <CircularProgress value={Math.round(Number(averageSentiment.previousMeasurement))} color='secondary' />
        </div>
      </div>
    </div>
  );
}
