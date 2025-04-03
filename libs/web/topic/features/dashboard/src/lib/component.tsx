'use client';

import { Spinner } from '@heroui/react';
import { Fragment, type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { DashboardStatistics, DashboardTopicTrends } from './components';

export function Dashboard(): ReactElement {
  const profile = useSelector(authSelectors.profile);

  const { data: overview, isLoading: isGeneralOverviewLoading } = organizationApi.useGetGeneralOverviewQuery(
    undefined,
    { skip: !profile },
  );
  const { data: organizaton, isLoading: isOrganizationLoading } = organizationApi.useGetOrganizationQuery(
    { id: overview?.id as number },
    { skip: !overview?.id },
  );
  const { isLoading: isTopicsOverviewLoading } = organizationApi.useGetTopicsOverviewQuery(undefined, {
    skip: !profile,
  });
  const { isLoading: isActiveListLoading } = topicApi.useSearchInfiniteQuery(
    { isActive: true, pageSize: 10 },
    { skip: !profile },
  );

  const isLoading = isGeneralOverviewLoading || isOrganizationLoading || isActiveListLoading || isTopicsOverviewLoading;

  return (
    <div className='min-h-full flex flex-col gap-2 justify-center'>
      {!overview || !organizaton || isLoading ? (
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
