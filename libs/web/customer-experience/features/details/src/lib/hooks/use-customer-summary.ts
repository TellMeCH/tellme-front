'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { customerApi, CustomerSummaryStatus } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

export function useCustomerSummary(customerId: number): typeof result {
  const [shouldRefetchSummary, setShouldRefetchSummary] = useState(true);
  const profile = useSelector(authSelectors.profile);

  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    error: loadingError,
  } = customerApi.useGetSummaryQuery(customerId, {
    skip: !profile || !shouldRefetchSummary,
    pollingInterval: 20 * 1000,
  });
  const [create, { error: creatingError }] = customerApi.useCreateSummaryMutation();

  const createSummary = async (): Promise<void> => {
    setShouldRefetchSummary(false);
    await create(customerId).unwrap();
    setShouldRefetchSummary(true);
  };

  useEffect(() => {
    if (!summaryResponse?.status) {
      return;
    }

    switch (summaryResponse.status) {
      case CustomerSummaryStatus.DOES_NOT_EXIST:
        createSummary();

        return;
      case CustomerSummaryStatus.GENERATING:
        setShouldRefetchSummary(true);

        return;
      default:
        setShouldRefetchSummary(false);
    }
  }, [summaryResponse?.status]);

  const result = { summaryResponse, isSummaryLoading, error: loadingError || creatingError };

  return result;
}
