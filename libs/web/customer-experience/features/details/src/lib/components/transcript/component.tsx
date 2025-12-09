import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { conversationApi } from '@tellme/web/shared/data-access/api';
import { Spinner } from '@tellme/web/shared/ui/ui-kit';
import { Message } from '../message';
import styles from './component.module.scss';

interface TranscriptProps {
  conversationId: number;
  customerFullName: string;
}

export function Transcript({ conversationId, customerFullName }: TranscriptProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.TRANSCRIPT');
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    conversationApi.useSearchTranscriptInfiniteQuery(
      { conversationId, params: { pageSize: 10 } },
      {
        skip: !isTranscriptVisible,
      },
    );
  const transcriptItems = useMemo(() => data?.pages.flatMap((page) => page.results) || [], [data]);

  const toggleTranscript = (): void => {
    setIsTranscriptVisible((isVisible) => !isVisible);
  };

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <Button
        onPress={toggleTranscript}
        variant='bordered'
        data-testid='toggle-transcript-button'
        endContent={
          <Icon
            name='arrow_up'
            theme='brand_primary'
            className={clsx('transition-transform', !isTranscriptVisible && 'rotate-180')}
          />
        }>
        {t('BUTTON_VIEW')}
      </Button>
      {isTranscriptVisible && (
        <div className='mt-6 rounded-xl bg-background-tertiary p-6 pr-4'>
          <InfiniteScroll
            height={515}
            className={styles.transcript__wrapper}
            dataLength={transcriptItems.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className='flex justify-center py-6'>
                <Spinner />
              </div>
            }>
            {isFetching && !isFetchingNextPage && (
              <div className='flex justify-center py-6'>
                <Spinner />
              </div>
            )}
            {transcriptItems.map((transcriptItem) => (
              <Message
                transcriptItem={transcriptItem}
                customerFullName={customerFullName}
                key={transcriptItem.id} />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
