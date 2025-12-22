'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContent, ToastService } from '@tellme/shared/ui/toast';
import { customerApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useOrganization } from '@tellme/web/shared/data-access/organization';

const pollingInterval = 10 * 1000;

export function useCustomer(id: number) {
  const t = useTranslations('customer-experience.DETAILS');
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const profile = useSelector(authSelectors.profile);

  const {
    data: customer,
    isLoading,
    error,
    isSuccess,
  } = customerApi.useGetQuery(
    { id },
    {
      skip: !profile || !shouldRefetch,
      pollingInterval,
    },
  );
  const { organization } = useOrganization();

  const startPolling = useCallback(() => {
    setShouldRefetch(true);
  }, []);

  const stopPolling = useCallback(() => {
    setShouldRefetch(false);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      stopPolling();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (customer?.hasTicket && organization?.ticketServer) {
      stopPolling();
      ToastService.showSuccess(
        <ToastContent title={t('TEXT_TICKET_SUCCESS_TITLE')} description={t('TEXT_TICKET_SUCCESS_DESCRIPTION')} />,
      );
    }
  }, [customer?.hasTicket]);

  return {
    customer,
    isLoading,
    error,
    startPolling,
    stopPolling,
  };
}
