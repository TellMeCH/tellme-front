import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { SuggestedTopic, suggestedTopicApi } from '@tellme/web/shared/data-access/api';

interface SuggestedItemProps {
  suggestedTopic: SuggestedTopic;
}

export function SuggestedItem({ suggestedTopic }: SuggestedItemProps): ReactElement {
  const t = useTranslations('topic.MANAGEMENT.SUGGESTED_ITEM');
  const [accept, { isLoading }] = suggestedTopicApi.useAcceptMutation();

  const acceptSuggestedTopic = () => {
    accept(suggestedTopic.id as number);
  };

  return (
    <div className='border-b border-separator py-2 flex flex-col gap-2 mb-2'>
      <div className='flex items-center justify-between'>
        <h3>{suggestedTopic.name}</h3>
        <Button
          onPress={acceptSuggestedTopic}
          isLoading={isLoading}
          variant='bordered'
          size='sm'
          radius='full'>
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
