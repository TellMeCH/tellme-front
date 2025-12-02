'use client';

import { ReactElement } from 'react';
import { CustomerExperiencesList } from '@tellme/web/customer-experience/features/list';
import { CustomerSearchParams, useFilteringSearchParams } from '@tellme/web/shared/utils/filtering-search-params';

export default function CustomerExperiencesPage(): ReactElement {
  const { initialSearchParams, setSearchParams } = useFilteringSearchParams<CustomerSearchParams>({
    searchParamsConstructor: CustomerSearchParams,
  });

  return <CustomerExperiencesList initialFilters={initialSearchParams} onChangeFilters={setSearchParams} />;
}
