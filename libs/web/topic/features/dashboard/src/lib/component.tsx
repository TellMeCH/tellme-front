import { DashboardHeader, DashboardStatistics, DashboardTopicTrends } from './components';
import type { ReactElement } from 'react';

export function Dashboard(): ReactElement {
  return (
    <div className='min-h-full flex flex-col gap-2'>
      <DashboardHeader />
      <DashboardStatistics />
      <DashboardTopicTrends />
    </div>
  );
}
