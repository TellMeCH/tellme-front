'use client';

import { Spinner, useDisclosure } from '@heroui/react';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Button, Header, Icon } from '@tellme/web/shared/ui/ui-kit';
import styles from './component.module.scss';
import { Item } from './components';
import { FormModal } from './components/form-modal';

export function TopicsManagement(): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const profile = useSelector(authSelectors.profile);
  const { data, isFetching, isLoading } = topicApi.useSearchInfiniteQuery({ pageSize: 10 }, { skip: !profile });

  const { isOpen: isFormModalOpen, onOpenChange: onFormModalOpenChange } = useDisclosure();

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(topicApi.endpoints.searchInfinite.initiate({ cursor: data.nextCursor }, { forceRefetch: true }));
    }
  };

  return (
    <div className='flex flex-col min-h-full gap-2'>
      <Header
        title={t('TEXT_TITLE')}
        rightContent={
          <Button onPress={onFormModalOpenChange} endContent={<Icon name='plus' />}>
            {t('BUTTON_NEW_TOPIC')}
          </Button>
        }
      />
      <div className='bg-background-secondary rounded-2xl py-6 px-9 flex flex-col flex-1 items-center'>
        <InfiniteScroll
          className={styles.management__list}
          dataLength={data?.results.length || 0}
          next={fetchNextPage}
          hasMore={!!data?.nextCursor}
          loader={<Spinner />}>
          {isLoading && <Spinner />}
          {data?.results.map((topic) => <Item topic={topic} key={topic.id} />)}
        </InfiniteScroll>
      </div>
      <FormModal isOpen={isFormModalOpen} onOpenChange={onFormModalOpenChange} />
    </div>
  );
}
