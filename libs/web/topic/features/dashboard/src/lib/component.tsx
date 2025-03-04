import { DashboardHeader, DashboardStatistics } from './components';
import type { ReactElement } from 'react';

export function Dashboard(): ReactElement {
  return (
    <div className='flex flex-col gap-2'>
      <DashboardHeader />
      <DashboardStatistics />
    </div>
  );
}
