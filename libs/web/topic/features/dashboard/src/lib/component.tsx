import { type ReactElement } from 'react';
import { Header, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { DashboardStatistics, DashboardTopicTrends } from './components';
import { statisticsMock } from './mocks/statistics';

export function Dashboard(): ReactElement {
  const { firstDate, secondDate, organisationName } = statisticsMock.general;

  return (
    <div className='flex flex-col gap-2'>
      <Header
        title={organisationName}
        titleClassName='uppercase'
        rightContent={
          <div className='flex flex-row items-center gap-4'>
            <p className='underline'>{formatDateRange(firstDate, secondDate)}</p>
            <Icon name='calendar' />
          </div>
        }
      />
      <DashboardStatistics />
      <DashboardTopicTrends />
    </div>
  );
}
