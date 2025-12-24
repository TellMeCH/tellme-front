'use client';

import { useTranslations } from 'next-intl';
import { ReactElement, useEffect } from 'react';
import { ToastContent, ToastService } from '@tellme/shared/ui/toast';
import { Button } from '@tellme/shared/ui/ui-kit';
import {
  ErrorResponse,
  SuggestedTopic,
  suggestedTopicApi,
  SuggestedTopicErrorData,
} from '@tellme/web/shared/data-access/api';

interface SuggestedItemProps {
  suggestedTopic: SuggestedTopic;
}

export function SuggestedItem({ suggestedTopic }: SuggestedItemProps): ReactElement {
  const t = useTranslations('topic.MANAGEMENT.SUGGESTED_ITEM');
  const [accept, { isLoading, isSuccess, error }] = suggestedTopicApi.useAcceptMutation();

  const acceptSuggestedTopic = () => {
    accept(suggestedTopic.id as number);
  };

  useEffect(() => {
    if (isSuccess) {
      ToastService.showSuccess(
        <ToastContent
          title={t('TEXT_TOAST_SUCCESS_TITLE', { name: suggestedTopic.name })}
          description={t.rich('TEXT_TOAST_SUCCESS_DESCRIPTION')}
        />,
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const hasLimitError = (error as ErrorResponse<SuggestedTopicErrorData>)?.data.nonFieldErrors?.includes(
        'Cannot add more topics to this organization; maximum topic count reached.',
      );

      if (hasLimitError) {
        ToastService.showError(t('TEXT_TOPICS_LIMIT'));
      }
    }
  }, [error]);

  return (
    <div className='border-b border-separator py-2 flex flex-col gap-2 mb-2' data-testid='suggested-item'>
      <div className='flex items-center justify-between'>
        <h3>{suggestedTopic.name}</h3>
        <Button
          onPress={acceptSuggestedTopic}
          isLoading={isLoading}
          variant='bordered'
          size='sm'
          radius='full'
          data-testid='accept-button'>
          {t('BUTTON_ACCEPT')}
        </Button>
      </div>
      <div className='text-xs'>
        {t('TEXT_CONVERSATION_COUNT')}: <b>{suggestedTopic.conversationsCount}</b>
      </div>
      <div className='text-xs'>{suggestedTopic.description}</div>
    </div>
  );
}
