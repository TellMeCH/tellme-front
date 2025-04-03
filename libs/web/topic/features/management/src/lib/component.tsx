'use client';

import { Spinner, useDisclosure } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { Topic, useSearchInfiniteTopics } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import styles from './component.module.scss';
import { Item } from './components';
import { FormModal } from './components/form-modal';

export function TopicsManagement(): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');

  const profile = useSelector(authSelectors.profile);
  const { data, isLoading, fetchNextPage } = useSearchInfiniteTopics({
    params: { pageSize: 10 },
    skip: !profile,
  });

  const { isOpen: isFormModalOpen, onOpenChange: onFormModalOpenChange } = useDisclosure();

  return (
    <div className='flex flex-col min-h-full gap-2'>
      <Header
        title={t('TEXT_TITLE')}
        rightContent={
          <Button
            onPress={onFormModalOpenChange}
            endContent={<Icon name='plus' />}
            data-testid='creation-modal-button'>
            {t('BUTTON_NEW_TOPIC')}
          </Button>
        }
      />
      <div className='bg-background-secondary rounded-2xl py-6 px-9 flex flex-col flex-1 items-center'>
        <InfiniteScroll
          className={styles.management__list}
          dataLength={data?.results.length || 0}
          next={fetchNextPage}
          scrollableTarget='main'
          hasMore={!data?.nextCursor}
          loader={
            <div className='flex justify-center py-6'>
              <Spinner />
            </div>
          }>
          {isLoading && <Spinner />}
          {data?.results.map((topic: Topic) => <Item topic={topic} key={topic.id} />)}
        </InfiniteScroll>
      </div>
      <FormModal isOpen={isFormModalOpen} onOpenChange={onFormModalOpenChange} />
    </div>
  );
}
