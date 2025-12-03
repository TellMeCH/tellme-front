'use client';

import { Spinner } from '@heroui/react';
import { Fragment, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { customerApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { BackButton, Header } from '@tellme/web/shared/ui/ui-kit';
import { CustomerInfo } from './components';

interface CustomerExperienceDetailsProps {
  id: number;
}

export function CustomerExperienceDetails({ id }: CustomerExperienceDetailsProps): ReactElement {
  const profile = useSelector(authSelectors.profile);
  const { data: customer, isLoading: isCustomerLoading } = customerApi.useGetQuery({ id }, { skip: !profile });
  const { data: summaryResponse, isLoading: isSummaryLoading } = customerApi.useGetSummaryQuery(id, { skip: !profile });

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
          <Header leftContent={<BackButton />} title={customer.latestConversationTitle} />
          <CustomerInfo customer={customer} summary={summaryResponse.summary} />
        </Fragment>
      )}
    </div>
  );
}
