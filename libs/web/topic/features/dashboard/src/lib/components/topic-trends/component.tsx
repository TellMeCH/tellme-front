'use client';

import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { Legend } from '@tellme/web/topic/ui/legend';
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
          <Legend label={formatDate(secondDate, DateTimeFormat.MONTH_ONLY)} color={styles.controlPrimary} />
          <Legend label={formatDate(firstDate, DateTimeFormat.MONTH_ONLY)} color={styles.controlSecondary} />
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
