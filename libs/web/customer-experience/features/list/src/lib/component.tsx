'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { customerApi, CustomerOrdering, CustomerPaginationRequest } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { CustomerSearchParams } from '@tellme/web/shared/utils/filtering-search-params';
import { Item, SortingSelect } from './components';

interface CustomerExperiencesListProps {
  initialFilters: CustomerSearchParams;
  onChangeFilters: (filters: CustomerSearchParams) => void;
}

export function CustomerExperiencesList({
  initialFilters,
  onChangeFilters,
}: CustomerExperiencesListProps): ReactElement {
  const t = useTranslations('customer-experience.LIST');

  const profile = useSelector(authSelectors.profile);

  const params: CustomerPaginationRequest = {
    pageSize: 10,
    ...initialFilters,
    ordering: (initialFilters.ordering as CustomerOrdering) || '-last_conversation_date',
  };
  const { data, hasNextPage, fetchNextPage, isLoading } = customerApi.useSearchInfiniteQuery(params, {
    skip: !profile,
  });
  const customers = useMemo(() => data?.pages.flatMap((page) => page.results) || [], [data]);

  const changeOrdering = (ordering: CustomerOrdering): void => {
    onChangeFilters({
      ...params,
      ordering,
    });
  };

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={t('TEXT_TITLE')} />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-8 gap-5'>
        <div className='flex items-center justify-between w-full'>
          <Heading level={2} className='text-base'>
            {t('TEXT_SUBTITLE')}
          </Heading>
          <SortingSelect value={params.ordering} onChange={changeOrdering} />
        </div>
        {isLoading && (
          <div className='flex justify-center py-6'>
            <Spinner />
          </div>
        )}
        <InfiniteScroll
          dataLength={customers.length}
          next={fetchNextPage}
          scrollableTarget='main'
          hasMore={hasNextPage}
          className='!overflow-x-hidden'
          loader={
            <div className='flex justify-center py-6'>
              <Spinner />
            </div>
          }>
          {customers.map((customer) => (
            <Item key={customer.idFromUrl} customer={customer} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
