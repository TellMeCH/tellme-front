import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { SuggestedTopic } from '@tellme/web/shared/data-access/api';
import { SuggestedItem } from '../suggested-item';

interface SuggestedTopicsProps {
  suggestedTopics: Array<SuggestedTopic>;
  onClose: () => void;
}

export function SuggestedTopics({ suggestedTopics, onClose }: SuggestedTopicsProps): ReactElement {
  const t = useTranslations('topic.MANAGEMENT.SUGGESTED_TOPICS');

  return (
    <div className='w-[26%] bg-background-highlighted rounded-2xl py-4 pl-4 pr-2 flex flex-col h-[calc(100vh-1.5rem)] sticky top-0 right-0'>
      <div className='flex items-end justify-between mb-2'>
        <h2 className='text-lg'>{t('TEXT_TITLE')}</h2>
        <Button
          onPress={onClose}
          color='tertiary'
          isIconOnly
          size='sm'>
          <Icon name='cross' theme='secondary' />
        </Button>
      </div>
      <div className='flex-1 overflow-y-auto pr-2.5'>
        {suggestedTopics.map((suggestedTopic) => (
          <SuggestedItem key={suggestedTopic.id} suggestedTopic={suggestedTopic} />
        ))}
      </div>
    </div>
  );
}
