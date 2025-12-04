'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { customerApi, CustomerSummaryStatus } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

export function useCustomerSummary(id: number) {
  const [shouldRefetchSummary, setShouldRefetchSummary] = useState(true);
  const profile = useSelector(authSelectors.profile);

  const { data: summaryResponse, isLoading: isSummaryLoading } = customerApi.useGetSummaryQuery(id, {
    skip: !profile || !shouldRefetchSummary,
    pollingInterval: 20 * 1000,
  });

  useEffect(() => {
    if (summaryResponse?.status === CustomerSummaryStatus.READY) {
      setShouldRefetchSummary(false);
    }
  }, [summaryResponse]);

  return { summaryResponse, isSummaryLoading };
}
