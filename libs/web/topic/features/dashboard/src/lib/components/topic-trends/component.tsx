'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { Legend } from '@tellme/web/topic/ui/legend';
import { useTopicTrends } from '../../hooks';
import { TopicTrendsItem } from '../topic-trends-item';
import styles from './component.module.scss';

const currentMonthColor = '#62aaed';
const previousMonthColor = '#bec9d4';

export function DashboardTopicTrends(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS');

  const { currentMonth, previousMonth, activeTopics, maxCount } = useTopicTrends();

  return (
    <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
      <div className='flex flex-row justify-between items-start'>
        <Heading level={2} className={styles['topic-trends__title']}>
          {t('TEXT_TOPIC_TRENDS')}
        </Heading>
        {currentMonth && previousMonth && (
          <div className='flex flex-row gap-4 items-center'>
            <Legend label={formatDate(currentMonth, DateTimeFormat.MONTH_ONLY)} color={currentMonthColor} />
            <Legend label={formatDate(previousMonth, DateTimeFormat.MONTH_ONLY)} color={previousMonthColor} />
          </div>
        )}
      </div>
      <div>
        {activeTopics?.map((itemProps) => (
          <TopicTrendsItem
            key={itemProps.topicKey}
            maxCount={maxCount}
            {...itemProps} />
        ))}
      </div>
    </div>
  );
}
