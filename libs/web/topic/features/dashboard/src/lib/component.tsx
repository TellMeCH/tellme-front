import { DashboardHeader } from '@tellme/web/topic/ui/dashboard-header';
import { DashboardStatistics } from './components';
import { statisticsMock } from './mocks/statistics';
import type { ReactElement } from 'react';

export function Dashboard(): ReactElement {
  return (
    <div className='flex flex-col gap-2'>
      <DashboardHeader {...statisticsMock} />
      <DashboardStatistics />
    </div>
  );
}
