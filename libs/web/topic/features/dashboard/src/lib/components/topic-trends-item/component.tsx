'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Measurement } from '@tellme/web/shared/data-access/api';
import { CircularProgress, AppProgress } from '@tellme/web/shared/ui/ui-kit';

interface TopicTrendsItemProps {
  name: string;
  description: string;
  maxProgressValue?: number;
  count: Measurement;
  averageSentiment: Measurement;
}

export function TopicTrendsItem({
  name,
  description,
  count,
  averageSentiment,
  maxProgressValue,
}: TopicTrendsItemProps): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS_ITEM');

  return (
    <div className='flex flex-row justify-between min-h-[140px] py-4 gap-[60px] border-b border-text-tertiary last:border-none'>
      <div className='flex flex-col gap-2 w-1/3'>
        <p className='text-xl'>{name}</p>
        <p className='text-sm'>{description}</p>
      </div>
      <div className='flex flex-col flex-1 w-1/3'>
        <p className='text-text-secondary mb-[22px]'>{t('TEXT_FREQUENCY')}</p>
        <div className='flex flex-col gap-1'>
          <AppProgress
            maxValue={maxProgressValue}
            value={Math.round(Number(count.firstMeasurement))}
            aria-label={t('TEXT_SECOND_MEASURMENT_AREA_LABEL')}
          />
          <AppProgress
            maxValue={maxProgressValue}
            value={Math.round(Number(count.secondMeasurement))}
            aria-label={t('TEXT_FIRST_MEASURMENT_AREA_LABEL')}
            color='secondary'
          />
        </div>
      </div>
      <div className='flex flex-col flex-1 w-1/5 pl-[5%]'>
        <p className='text-text-secondary mb-2'>{t('TEXT_CUSTOMER_ENGAGEMENT')}</p>
        <div className='flex flex-row gap-[68px]'>
          <CircularProgress value={Math.round(Number(averageSentiment.firstMeasurement))} />
          <CircularProgress value={Math.round(Number(averageSentiment.secondMeasurement))} color='secondary' />
        </div>
      </div>
    </div>
  );
}
