'use client';

import { Spinner } from '@heroui/react';
import { Fragment, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { conversationApi, customerApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { BackButton, Header } from '@tellme/web/shared/ui/ui-kit';
import { ConversationInfo, CustomerInfo, OtherConversations, SuggestedEmail } from './components';
import { useCustomerSummary } from './hooks';

interface CustomerExperienceDetailsProps {
  id: number;
}

export function CustomerExperienceDetails({ id }: CustomerExperienceDetailsProps): ReactElement {
  const profile = useSelector(authSelectors.profile);
  const { data: customer, isLoading: isCustomerLoading } = customerApi.useGetQuery({ id }, { skip: !profile });
  const { summaryResponse, isSummaryLoading } = useCustomerSummary(id);
  const { data: latestConversation } = conversationApi.useGetQuery(
    { id: customer?.latestConversationId as number },
    { skip: !customer },
  );
  const { data: conversationsResponse, isLoading: areConversationsLoading } = conversationApi.useSearchByCustomerQuery(
    id,
    { skip: !profile },
  );

  const otherConversations = useMemo(
    () =>
      conversationsResponse?.results.filter(
        (conversation) => conversation.idFromUrl !== latestConversation?.idFromUrl,
      ) || [],
    [conversationsResponse],
  );
  const isLoading = isCustomerLoading || isSummaryLoading || areConversationsLoading;

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
          {otherConversations.length > 0 && <OtherConversations conversations={otherConversations} />}
        </Fragment>
      )}
    </div>
  );
}
