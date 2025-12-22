'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ToastContent, ToastService } from '@tellme/shared/ui/toast';
import { customerApi, CustomerTicketStatus } from '@tellme/web/shared/data-access/api';

const pollingInterval = 10 * 1000;

export function useTicket(customerId: number): typeof result {
  const t = useTranslations('customer-experience.DETAILS');
  const [shouldPoll, setShouldPoll] = useState(false);

  const [create, { isLoading: isCreating }] = customerApi.useCreateTicketMutation();
  const { data: ticket, isFetching } = customerApi.useGetTicketQuery(customerId, {
    skip: !shouldPoll,
    pollingInterval,
  });

  const createTicket = async (): Promise<void> => {
    await create(customerId).unwrap();
    setShouldPoll(true);
  };

  useEffect(() => {
    if (ticket?.status === CustomerTicketStatus.READY) {
      setShouldPoll(false);
      ToastService.showSuccess(
        <ToastContent title={t('TEXT_TICKET_SUCCESS_TITLE')} description={t('TEXT_TICKET_SUCCESS_DESCRIPTION')} />,
      );
    }
  }, [ticket?.status]);

  const result = {
    createTicket,
    isLoading: isCreating || isFetching || ticket?.isCreating,
  };

  return result;
}
