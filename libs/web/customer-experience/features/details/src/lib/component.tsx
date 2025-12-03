'use client';

import { Spinner } from '@heroui/react';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { conversationApi, customerApi, CustomerSummaryStatus } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { BackButton, Header } from '@tellme/web/shared/ui/ui-kit';
import { ConversationInfo, CustomerInfo, SuggestedEmail } from './components';

interface CustomerExperienceDetailsProps {
  id: number;
}

export function CustomerExperienceDetails({ id }: CustomerExperienceDetailsProps): ReactElement {
  const [shouldRefetchSummary, setShouldRefetchSummary] = useState(true);

  const profile = useSelector(authSelectors.profile);
  const { data: customer, isLoading: isCustomerLoading } = customerApi.useGetQuery({ id }, { skip: !profile });
  const { data: summaryResponse, isLoading: isSummaryLoading } = customerApi.useGetSummaryQuery(id, {
    skip: !profile || !shouldRefetchSummary,
    pollingInterval: 20 * 1000,
  });
  const { data: latestConversation } = conversationApi.useGetQuery(
    { id: customer?.latestConversationId as number },
    { skip: !customer?.latestConversationId },
  );

  const isLoading = isCustomerLoading || isSummaryLoading;

  useEffect(() => {
    if (summaryResponse?.status === CustomerSummaryStatus.READY) {
      setShouldRefetchSummary(false);
    }
  }, [summaryResponse]);

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
          <SuggestedEmail summary={summaryResponse.summary} />
          {latestConversation && <ConversationInfo conversation={latestConversation} />}
        </Fragment>
      )}
    </div>
  );
}
