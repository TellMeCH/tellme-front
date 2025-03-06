'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';
import { TopicTrendsItem } from '../topic-trends-item';
import styles from './component.module.scss';

// TODO: Fill by real data
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
        {statisticsMock.topics.map((itemProps) => (
          <TopicTrendsItem key={itemProps.name} {...itemProps} />
        ))}
      </div>
    </div>
  );
}
