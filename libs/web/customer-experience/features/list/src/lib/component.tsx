'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { customerApi } from '@tellme/web/shared/data-access/api';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';
import { Item } from './components';

export function CustomerExperiencesList(): ReactElement {
  const t = useTranslations('customer-experience.LIST');
  const { data, hasNextPage, fetchNextPage } = customerApi.useSearchInfiniteQuery({});
  const customers = useMemo(() => data?.pages.flatMap((page) => page.results) || [], [data]);

  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={t('TEXT_TITLE')} />
      <div className='flex-1 flex flex-col bg-background-secondary rounded-2xl py-6 px-8 gap-5'>
        <div className='flex items-center justify-between'>
          <Heading level={2} className='text-default'>
            {t('TEXT_SUBTITLE')}
          </Heading>
          {/* TODO: add filters */}
        </div>
        <InfiniteScroll
          dataLength={customers.length}
          next={fetchNextPage}
          scrollableTarget='main'
          hasMore={hasNextPage}
          /*className='!overflow-x-hidden'*/
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
