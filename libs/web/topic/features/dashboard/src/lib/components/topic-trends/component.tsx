import { Progress } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { CircularProgress, Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';
import styles from './component.module.scss';

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
        {statisticsMock.topics.map((topic) => (
          <div key={topic.name} className='flex flex-row mt-4 mb-[30px] gap-[60px]'>
            <div className='flex flex-col max-w-80 gap-2'>
              <p className='text-xl'>{topic.name}</p>
              <p className='text-sm'>{topic.description}</p>
            </div>
            <div className='flex flex-col flex-1 max-w-80'>
              <p className='text-text-secondary mb-[22px]'>Frequency</p>
              <div className='flex flex-col gap-1'>
                {/* NOTE: Values from api example aren't normalized, so using completely made up values */}
                <span className='flex flex-row items-center gap-2'>
                  <Progress
                    aria-label='First progress'
                    classNames={{
                      base: 'h-2',
                      track: 'bg-control-primary-transparent',
                      indicator: 'bg-control-primary',
                    }}
                    value={70}
                  />
                  35
                </span>
                <span className='flex flex-row items-center gap-2'>
                  <Progress
                    aria-label='Second progress'
                    classNames={{
                      base: 'h-2',
                      track: 'bg-control-secondary-transparent',
                      indicator: 'bg-control-secondary',
                    }}
                    value={60}
                  />
                  25
                </span>
              </div>
            </div>
            <div className='flex flex-col flex-1 max-w-80'>
              <p className='text-text-secondary mb-2'>Frequency</p>
              <div className='flex flex-row gap-[68px]'>
                <CircularProgress value={1} />
                <CircularProgress
                  value={3}
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
