'use client';

import { Spinner } from '@heroui/react';
import { Fragment, type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { EmptyChart } from '@tellme/web/topic/ui/empty-chart';
import { DashboardStatistics, DashboardTopicTrends } from './components';

export function Dashboard(): ReactElement {
  const profile = useSelector(authSelectors.profile);

  const { data: generalOverview, isLoading: isGeneralOverviewLoading } = organizationApi.useGetGeneralOverviewQuery(
    undefined,
    { skip: !profile },
  );
  const { data: organizaton, isLoading: isOrganizationLoading } = organizationApi.useGetOrganizationQuery(
    { id: generalOverview?.id as number },
    { skip: !generalOverview?.id },
  );
  const { isLoading: isTopicsOverviewLoading } = organizationApi.useGetTopicsOverviewQuery(undefined, {
    skip: !profile,
  });
  const { isLoading: isAllSummariesLoading } = topicApi.useGetAllSummariesQuery(undefined, { skip: !profile });

  const topicsOverview = null;

  const isLoading =
    isGeneralOverviewLoading || isOrganizationLoading || isTopicsOverviewLoading || isAllSummariesLoading;

  return (
    <div className='min-h-full flex flex-col gap-2 justify-center'>
      {!generalOverview || !organizaton || isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Header
            title={organizaton?.name || ''}
            titleClassName='uppercase'
            rightContent={
              generalOverview.firstDate &&
              generalOverview.secondDate && (
                <p>{formatDateRange(generalOverview.firstDate, generalOverview.secondDate)}</p>
              )
            }
          />
          {!topicsOverview ? (
            <EmptyChart containerClassName='bg-background-secondary rounded-2xl' />
          ) : (
            <Fragment>
              <DashboardStatistics />
              <DashboardTopicTrends />
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
}
