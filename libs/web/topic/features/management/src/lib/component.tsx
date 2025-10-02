'use client';

import { Spinner, useDisclosure } from '@heroui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { suggestedTopicApi, Topic, topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header, Tooltip } from '@tellme/web/shared/ui/ui-kit';
import { FormModal, Item, SuggestedTopics } from './components';

export function TopicsManagement(): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');

  const profile = useSelector(authSelectors.profile);
  // hardcoded, 20 topics per page allow to get all possible topics
  const { data: topicsResponse, isLoading: areTopicsLoading } = topicApi.useSearchQuery(
    { pageSize: 20 },
    { skip: !profile },
  );
  const { data: suggestedTopicsResponse, isLoading: areSuggestedTopicsLoading } = suggestedTopicApi.useSearchQuery(
    {},
    { skip: !profile },
  );
  const isLoading = areTopicsLoading || areSuggestedTopicsLoading;
  const areSuggestedTopicsReady = !!suggestedTopicsResponse?.results.length && !isLoading;

  const { isOpen: isFormModalOpen, onOpenChange: onFormModalOpenChange } = useDisclosure();
  const [areSuggestedTopicsOpen, setAreSuggestedTopicsOpen] = useState(false);

  const openSuggestedTopics = (): void => setAreSuggestedTopicsOpen(true);
  const closeSuggestedTopics = (): void => setAreSuggestedTopicsOpen(false);

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
      <div className={clsx('flex gap-2', isLoading && 'justify-center items-center')}>
        {isLoading && <Spinner />}
        {topicsResponse?.results.length && !isLoading && (
          <div
            className={clsx(
              'bg-background-secondary rounded-2xl py-6 px-9',
              areSuggestedTopicsOpen && areSuggestedTopicsReady && 'w-[calc(74%-0.75rem)]',
              !areSuggestedTopicsOpen && areSuggestedTopicsReady && 'w-[calc(100%-32px-0.5rem)]',
            )}>
            {topicsResponse?.results.map((topic: Topic) => <Item topic={topic} key={topic.idFromUrl} />)}
          </div>
        )}
        {areSuggestedTopicsOpen && areSuggestedTopicsReady && (
          <SuggestedTopics suggestedTopics={suggestedTopicsResponse.results} onClose={closeSuggestedTopics} />
        )}
        {!areSuggestedTopicsOpen && areSuggestedTopicsReady && (
          <Tooltip content={t('TEXT_VIEW_SUGGESTED_TOPICS')} placement='left'>
            <Button
              color='tertiary'
              variant='solid'
              onPress={openSuggestedTopics}
              isIconOnly
              size='sm'
              className='sticky top-2'
              data-testid='suggested-topics-button'>
              <Icon name='expand' theme='secondary' />
            </Button>
          </Tooltip>
        )}
      </div>
      <FormModal isOpen={isFormModalOpen} onOpenChange={onFormModalOpenChange} />
    </div>
  );
}
