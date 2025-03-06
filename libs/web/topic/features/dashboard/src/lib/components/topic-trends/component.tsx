'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { CircularProgress, Heading, LabeledProgress } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';
import styles from './component.module.scss';

//NOTE: Values are hardcoded in this component, because we still
export function DashboardTopicTrends(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS');
  const { firstDate, secondDate } = statisticsMock.general;

  return (
    <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
      <div className='flex flex-row justify-between items-start'>
        <Heading level={2} className={styles['topic-trends__title']}>
          {t('TEXT_TOPIC_TRENDS')}
        </Heading>
        <div className='flex flex-row gap-4 items-center'>
          <p className='relative flex items-center gap-[10px]'>
            <span className='w-3 h-3 bg-control-primary rounded-full' />
            {formatDate(secondDate, DateTimeFormat.MONTH_ONLY)}
          </p>
          <p className='relative flex items-center gap-[10px]'>
            <span className='w-3 h-3 bg-control-secondary rounded-full' />
            {formatDate(firstDate, DateTimeFormat.MONTH_ONLY)}
          </p>
        </div>
      </div>
      <div>
        {statisticsMock.topics.map(({ name, description, averageDuration, averageSentiment }) => (
          <div
            key={name}
            className='flex flex-row h-[140px] pt-4 gap-[60px] border-b  border-text-tertiary last:border-none'>
            <div className='flex flex-col max-w-80 gap-2'>
              <p className='text-xl'>{name}</p>
              <p className='text-sm'>{description}</p>
            </div>
            <div className='flex flex-col flex-1 max-w-80'>
              <p className='text-text-secondary mb-[22px]'>{t('TEXT_FREQUENCY')}</p>
              <div className='flex flex-col gap-1'>
                <LabeledProgress value={averageDuration.secondMeasurement} />
                <LabeledProgress value={averageDuration.firstMeasurement} color='secondary' />
              </div>
            </div>
            <div className='flex flex-col flex-1 max-w-80'>
              <p className='text-text-secondary mb-2'>{t('TEXT_CUSTOMER_ENGAGEMENT')}</p>
              <div className='flex flex-row gap-[68px]'>
                <CircularProgress value={averageSentiment.secondMeasurement} />
                <CircularProgress
                  value={averageSentiment.firstMeasurement}
                  trackColorClassName='text-control-secondary-transparent'
                  indicatorColorClassName='text-control-secondary'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
