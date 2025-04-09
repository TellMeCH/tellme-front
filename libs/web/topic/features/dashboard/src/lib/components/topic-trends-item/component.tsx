'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { CircularProgress, AppProgress } from '@tellme/web/shared/ui/ui-kit';
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
    <div className='flex flex-row justify-between min-h-[140px] py-4 gap-[60px] border-b border-text-tertiary last:border-none'>
      <div className='flex flex-col gap-2 w-1/3'>
        <Link
          href={{ pathname: navigationConfig.routes.private.topicAnalysis, query: { topicKey } }}
          className='text-xl hover:underline'>
          {name}
        </Link>
        <p className='text-sm'>{description}</p>
      </div>
      <div className='flex flex-col flex-1 w-1/3'>
        <p className='text-text-secondary mb-[22px]'>{t('TEXT_FREQUENCY')}</p>
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
        <p className='text-text-secondary mb-2'>{t('TEXT_CUSTOMER_ENGAGEMENT')}</p>
        <div className='flex flex-row gap-[68px]'>
          <CircularProgress value={Math.round(Number(averageSentiment.currentMeasurement))} />
          <CircularProgress value={Math.round(Number(averageSentiment.previousMeasurement))} color='secondary' />
        </div>
      </div>
    </div>
  );
}
