'use client';

import { Spinner } from '@heroui/react';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Button, Header, Icon } from '@tellme/web/shared/ui/ui-kit';
import { Item } from './components';

export function TopicsManagement(): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');
  const showUnderDevelopment = useShowUnderDevelopment();
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const profile = useSelector(authSelectors.profile);
  const { data, isFetching, isLoading } = topicApi.useSearchInfiniteQuery({}, { skip: !profile });

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(topicApi.endpoints.searchInfinite.initiate({ cursor: data.nextCursor }, { forceRefetch: true }));
    }
  };

  return (
    <div>
      <Header
        title={t('TEXT_TITLE')}
        rightContent={
          <Button onPress={showUnderDevelopment} endContent={<Icon name='plus' />}>
            {t('BUTTON_NEW_TOPIC')}
          </Button>
        }
      />
      <InfiniteScroll
        className='overflow-hidden'
        dataLength={data?.results.length || 0}
        next={fetchNextPage}
        hasMore={!!data?.nextCursor}
        loader={<Spinner />}>
        <div className='bg-background-secondary rounded-2xl py-6 px-9 flex flex-col flex-1'>
          {isLoading && <Spinner />}
          {data?.results.map((topic) => <Item topic={topic} key={topic.id} />)}
        </div>
      </InfiniteScroll>
    </div>
  );
}
