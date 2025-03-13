'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { CircularProgress, AppProgress } from '@tellme/web/shared/ui/ui-kit';

interface TopicTrendsItemProps {
  name: string;
  description: string;
  averageDuration: { firstMeasurement: number; secondMeasurement: number };
  averageSentiment: { firstMeasurement: number; secondMeasurement: number };
}

export function TopicTrendsItem({
  name,
  description,
  averageDuration,
  averageSentiment,
}: TopicTrendsItemProps): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS_ITEM');

  return (
    <div className='flex flex-row h-[140px] pt-4 gap-[60px] border-b border-text-tertiary last:border-none'>
      <div className='flex flex-col max-w-80 gap-2'>
        <p className='text-xl'>{name}</p>
        <p className='text-sm'>{description}</p>
      </div>
      <div className='flex flex-col flex-1 max-w-80'>
        <p className='text-text-secondary mb-[22px]'>{t('TEXT_FREQUENCY')}</p>
        <div className='flex flex-col gap-1'>
          <AppProgress value={averageDuration.secondMeasurement} aria-label={t('TEXT_SECOND_MEASURMENT_AREA_LABEL')} />
          <AppProgress
            value={averageDuration.firstMeasurement}
            aria-label={t('TEXT_FIRST_MEASURMENT_AREA_LABEL')}
            color='secondary'
          />
        </div>
      </div>
      <div className='flex flex-col flex-1 max-w-80'>
        <p className='text-text-secondary mb-2'>{t('TEXT_CUSTOMER_ENGAGEMENT')}</p>
        <div className='flex flex-row gap-[68px]'>
          <CircularProgress value={averageSentiment.secondMeasurement} />
          <CircularProgress value={averageSentiment.firstMeasurement} color='secondary' />
        </div>
      </div>
    </div>
  );
}
