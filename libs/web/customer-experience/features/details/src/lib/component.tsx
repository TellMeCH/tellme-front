'use client';

import { Spinner } from '@heroui/react';
import { Fragment, ReactElement } from 'react';
import { customerApi } from '@tellme/web/shared/data-access/api';
import { BackButton, Header } from '@tellme/web/shared/ui/ui-kit';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { CustomerInfo, SuggestedEmail } from './components';

interface CustomerExperienceDetailsProps {
  id: number;
}

export function CustomerExperienceDetails({ id }: CustomerExperienceDetailsProps): ReactElement {
  const { data: customer, isLoading: isCustomerLoading } = customerApi.useGetQuery({ id });
  const { data: summaryResponse, isLoading: isSummaryLoading } = customerApi.useGetSummaryQuery(id);

  const isLoading = isCustomerLoading || isSummaryLoading;

  return (
    <div className='min-h-full flex flex-col gap-2'>
      {isLoading && (
        <div className='flex flex-1 items-center justify-center'>
          <Spinner />
        </div>
      )}
      {customer && summaryResponse && (
        <Fragment>
          <Header
            leftContent={<BackButton link={navigationConfig.routes.private.customerExperiences.list()} />}
            title={customer.latestConversationTitle}
          />
          <CustomerInfo customer={customer} summary={summaryResponse.summary} />
          <SuggestedEmail summary={summaryResponse.summary} />
        </Fragment>
      )}
    </div>
  );
}
