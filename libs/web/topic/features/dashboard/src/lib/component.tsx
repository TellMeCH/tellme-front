'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Fragment, type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import { EmptyChart } from '@tellme/web/topic/ui/empty-chart';
import { DashboardStatistics, DashboardTopicTrends } from './components';

export function Dashboard(): ReactElement {
  const t = useTranslations('topic.DASHBOARD');
  const profile = useSelector(authSelectors.profile);

  const { data: generalOverview, isLoading: isGeneralOverviewLoading } = organizationApi.useGetGeneralOverviewQuery(
    undefined,
    { skip: !profile },
  );
  const { data: organizaton, isLoading: isOrganizationLoading } = organizationApi.useGetOrganizationQuery(
    { id: generalOverview?.id as number },
    { skip: !generalOverview?.id },
  );
  const { data: topicsOverview, isLoading: isTopicsOverviewLoading } = organizationApi.useGetTopicsOverviewQuery(
    undefined,
    {
      skip: !profile,
    },
  );
  const { isLoading: isAllSummariesLoading } = topicApi.useGetAllSummariesQuery(undefined, {
    skip: !profile,
  });

  const isLoading =
    isGeneralOverviewLoading || isOrganizationLoading || isTopicsOverviewLoading || isAllSummariesLoading;

  return (
    <div className='min-h-full flex flex-col gap-2 justify-center'>
      {!generalOverview || !organizaton || isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Header
            titleTestId='organization-name'
            title={organizaton?.name || ''}
            titleClassName='uppercase'
            rightContent={
              generalOverview.currentMonth &&
              generalOverview.previousMonth && (
                <p data-testid='date-range'>
                  {formatDateRange(generalOverview.previousMonth, generalOverview.currentMonth)}
                </p>
              )
            }
          />
          {!topicsOverview ? (
            <EmptyChart
              title={t('TEXT_EMPTY_CHART_TITLE')}
              subtitle={t('TEXT_EMPTY_CHART_SUBTITLE')}
              containerClassName='bg-background-secondary rounded-2xl'
            />
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
