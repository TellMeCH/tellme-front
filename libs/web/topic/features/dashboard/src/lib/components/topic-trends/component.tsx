import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';

export function DashboardTopicTrends(): ReactElement {
  const t = useTranslations('topic.DASHBOARD.TOPIC_TRENDS');
  const { firstDate, secondDate } = statisticsMock.general;

  return (
    <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
      <div className='flex flex-row justify-between items-start'>
        <p className='uppercase font-bold'>{t('TEXT_TOPIC_TRENDS')}</p>
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
        {statisticsMock.topics.map((topic) => (
          <div key={topic.name} className='flex flex-row mt-4 mb-[30px]'>
            <div className='flex flex-col max-w-80 gap-2'>
              <p className='text-xl'>{topic.name}</p>
              <p className='text-sm'>{topic.description}</p>
            </div>
            <div />
            <div />
          </div>
        ))}
      </div>
    </div>
  );
}
