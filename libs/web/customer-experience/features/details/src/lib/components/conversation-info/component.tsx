import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Conversation } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { appConstants } from '@tellme/web/shared/utils/constants';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { useFormatCallDuration } from '../../hooks';
import { TopicChip } from '../topic-chip';

interface ConversationInfoProps {
  conversation: Conversation;
}

const keyClassName = 'text-sm text-text-secondary mb-2 font-normal';

export function ConversationInfo({ conversation }: ConversationInfoProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.CONVERSATION_INFO');
  const formatCallDuration = useFormatCallDuration();

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <Heading level={2} className='text-base mb-6'>
        {t('TEXT_TITLE')}
      </Heading>

      <div className='flex mb-6'>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_DATE')}</div>
          <div>{formatDate(conversation.date, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}</div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_CUSTOMER_ENGAGEMENT')}</div>
          <div>
            {conversation.sentiment.toFixed(1)}/{appConstants.maxCustomerEngagement.toFixed(1)}
          </div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_CALL_DURATION')}</div>
          <div>{formatCallDuration(conversation.durationSeconds)}</div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_RESOLVED')}</div>
          <div>{t(`TEXT_${conversation.isResolved ? 'YES' : 'NO'}`)}</div>
        </div>
      </div>

      <div className='max-w-[900px]'>
        <Heading level={3} className={keyClassName}>
          {t('TEXT_SUMMARY')}
        </Heading>
        <p className='mb-6'>{conversation.summary}</p>
        <div className='flex flex-wrap gap-2'>
          {conversation.suggestedTopics.map((suggestedTopic) => (
            <TopicChip
              key={suggestedTopic.name}
              name={suggestedTopic.name}
              isSuggested />
          ))}
          {conversation.topics.map((topic) => (
            <TopicChip key={topic.idFromUrl} name={topic.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
