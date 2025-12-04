'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { customerApi, CustomerOrdering, CustomerPaginationRequest } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header, Heading, SearchInput } from '@tellme/web/shared/ui/ui-kit';
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
  const { data, hasNextPage, fetchNextPage, error, isFetching, isFetchingNextPage } =
    customerApi.useSearchInfiniteQuery(params, {
      skip: !profile,
    });
  const customers = useMemo(() => data?.pages.flatMap((page) => page.results) || [], [data]);

  const changeOrdering = (ordering: CustomerOrdering): void => {
    onChangeFilters({
      ...params,
      ordering,
    });
  };

  const changeQuery = (query: string): void => {
    onChangeFilters({
      ...params,
      query,
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
          <div className='flex gap-6'>
            <SortingSelect value={params.ordering} onChange={changeOrdering} />
            <SearchInput
              defaultValue={params.query}
              onChange={changeQuery}
              classNames={{ base: 'w-[327px]' }}
              data-testid='search-input'
            />
          </div>
        </div>
        {isFetching && !isFetchingNextPage ? (
          <div className='flex justify-center py-6'>
            <Spinner />
          </div>
        ) : error ? (
          <p className='text-center mt-6'>{t('TEXT_NO_RESULTS_FOUND')}</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
