'use client';

import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { DashboardStatistics, DashboardTopicTrends } from './components';

export function Dashboard(): ReactElement {
  const profile = useSelector(authSelectors.profile);

  const { data: { firstDate, secondDate, id } = {} } = organizationApi.useGetOverviewDataQuery({}, { skip: !profile });
  const { data: organizaton } = organizationApi.useGetOrganizationQuery({ id }, { skip: !id });

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header
        title={organizaton?.name || ''}
        titleClassName='uppercase'
        rightContent={firstDate && secondDate && <p>{formatDateRange(firstDate, secondDate)}</p>}
      />
      <DashboardStatistics />
      <DashboardTopicTrends />
    </div>
  );
}
