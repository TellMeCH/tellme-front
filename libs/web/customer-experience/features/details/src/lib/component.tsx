'use client';

import { Spinner } from '@heroui/react';
import { HttpStatusCode } from 'axios';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { conversationApi, customerApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { BackButton, Header } from '@tellme/web/shared/ui/ui-kit';
import { ConversationInfo, CustomerInfo, OtherConversations, SuggestedEmail, Transcript } from './components';
import { useCustomerSummary } from './hooks';

interface CustomerExperienceDetailsProps {
  id: number;
  conversationId?: number;
}

export function CustomerExperienceDetails({ id, conversationId }: CustomerExperienceDetailsProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS');

  const profile = useSelector(authSelectors.profile);
  const {
    data: customer,
    isLoading: isCustomerLoading,
    error: customerError,
  } = customerApi.useGetQuery({ id }, { skip: !profile });
  const detailedConversationId = conversationId || customer?.latestConversationId;

  const { summaryResponse, isSummaryLoading, error: summaryError } = useCustomerSummary(id);
  const { data: detailedConversation, error: detailedConversationError } = conversationApi.useGetQuery(
    { id: detailedConversationId as number },
    { skip: !detailedConversationId || !profile },
  );
  const {
    data: conversationsResponse,
    isLoading: areConversationsLoading,
    error: conversationsError,
  } = conversationApi.useSearchByCustomerQuery(id, { skip: !profile });

  const otherConversations = useMemo(
    () =>
      conversationsResponse?.results.filter((conversation) => conversation.idFromUrl !== detailedConversationId) || [],
    [conversationsResponse, detailedConversation],
  );
  const isLoading = isCustomerLoading || isSummaryLoading || areConversationsLoading;
  const error = customerError || summaryError || detailedConversationError || conversationsError;
  const isNotFound = error && Number(error.code) === HttpStatusCode.NotFound;

  return (
    <div className='min-h-full flex flex-col gap-2'>
      {(isLoading || isNotFound) && (
        <div className='flex flex-1 items-center justify-center'>
          {isLoading && <Spinner />}
          {isNotFound && <p>{t('TEXT_NOT_FOUND')}</p>}
        </div>
      )}
      {customer && summaryResponse && detailedConversation && (
        <Fragment>
          <Header leftContent={<BackButton />} title={detailedConversation?.title} />
          <CustomerInfo customer={customer} summary={summaryResponse.summary} />
          <SuggestedEmail summary={summaryResponse.summary} />
          <ConversationInfo conversation={detailedConversation} />
          {otherConversations.length > 0 && <OtherConversations conversations={otherConversations} customerId={id} />}
          {detailedConversationId && (
            <Transcript conversationId={detailedConversationId} customerFullName={customer.fullName} />
          )}
        </Fragment>
      )}
    </div>
  );
}
