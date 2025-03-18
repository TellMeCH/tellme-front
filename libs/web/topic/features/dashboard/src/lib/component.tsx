'use client';

import { Spinner } from '@heroui/react';
import { Fragment, type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { DashboardStatistics, DashboardTopicTrends } from './components';

export function Dashboard(): ReactElement {
  const profile = useSelector(authSelectors.profile);

  const { data: overview, isLoading: isOverviewLoading } = organizationApi.useGetGeneralOverviewQuery(
    {},
    { skip: !profile },
  );
  const { data: organizaton, isLoading: isOrganizationLoading } = organizationApi.useGetOrganizationQuery(
    { id: overview?.id },
    { skip: !overview?.id },
  );

  return (
    <div className='min-h-full flex flex-col gap-2 justify-center'>
      {!overview || !organizaton || isOrganizationLoading || isOverviewLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Header
            title={organizaton?.name || ''}
            titleClassName='uppercase'
            rightContent={
              overview.firstDate &&
              overview.secondDate && <p>{formatDateRange(overview.firstDate, overview.secondDate)}</p>
            }
          />
          <DashboardStatistics />
          <DashboardTopicTrends />
        </Fragment>
      )}
    </div>
  );
}
