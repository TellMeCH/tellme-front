'use client';

import { ReactElement, Suspense } from 'react';
import { CustomerExperiencesList } from '@tellme/web/customer-experience/features/list';
import { CustomerSearchParams, useFilteringSearchParams } from '@tellme/web/shared/utils/filtering-search-params';

function CustomerExperiencesWithParams(): ReactElement {
  const { initialSearchParams, setSearchParams } = useFilteringSearchParams<CustomerSearchParams>({
    searchParamsConstructor: CustomerSearchParams,
  });

  return <CustomerExperiencesList initialFilters={initialSearchParams} onChangeFilters={setSearchParams} />;
}

export default function CustomerExperiencesPage(): ReactElement {
  return (
    <Suspense>
      <CustomerExperiencesWithParams />
    </Suspense>
  );
}
