import { useTranslations } from 'next-intl';
import { Fragment, ReactElement, useState } from 'react';
import { Conversation, DetailedConversation } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { appConstants } from '@tellme/web/shared/utils/constants';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { useFormatCallDuration } from '../../hooks';
import { TopicChip } from '../topic-chip';

interface ConversationInfoProps {
  initialSelectedConversation: DetailedConversation;
  conversations: Array<Conversation>;
}

const keyClassName = 'text-sm text-text-secondary mb-2 font-normal';
const blockClassName = 'bg-background-secondary rounded-2xl py-6 px-8';

export function ConversationsInfo({ initialSelectedConversation, conversations }: ConversationInfoProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.CONVERSATIONS_INFO');
  const formatCallDuration = useFormatCallDuration();

  const [selectedConversation, setSelectedConversation] = useState<DetailedConversation>(initialSelectedConversation);

  const otherConversations = conversations.filter(
    (conversation) => conversation.idFromUrl !== selectedConversation.idFromUrl,
  );

  return (
    <Fragment>
      <div className={blockClassName}>
        <Heading level={2} className='text-base mb-6'>
          {t('TEXT_CONVERSATION')}
        </Heading>

        <div className='flex mb-6'>
          <div className='basis-1/4'>
            <div className={keyClassName}>{t('TEXT_DATE')}</div>
            <div>{formatDate(selectedConversation.date, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}</div>
          </div>
          <div className='basis-1/4'>
            <div className={keyClassName}>{t('TEXT_CUSTOMER_ENGAGEMENT')}</div>
            <div>
              {selectedConversation.sentiment.toFixed(1)}/{appConstants.maxCustomerEngagement.toFixed(1)}
            </div>
          </div>
          <div className='basis-1/4'>
            <div className={keyClassName}>{t('TEXT_CALL_DURATION')}</div>
            <div>{formatCallDuration(selectedConversation.durationSeconds)}</div>
          </div>
          <div className='basis-1/4'>
            <div className={keyClassName}>{t('TEXT_RESOLVED')}</div>
            <div>{t(`TEXT_${selectedConversation.isResolved ? 'YES' : 'NO'}`)}</div>
          </div>
        </div>

        <div className='max-w-[900px]'>
          <Heading level={3} className={keyClassName}>
            {t('TEXT_SUMMARY')}
          </Heading>
          <p className='mb-6'>{selectedConversation.summary}</p>
          <div className='flex flex-wrap gap-2'>
            {selectedConversation.suggestedTopics.map((suggestedTopic) => (
              <TopicChip
                key={suggestedTopic.name}
                name={suggestedTopic.name}
                isSuggested />
            ))}
            {selectedConversation.topics.map((topic) => (
              <TopicChip key={topic.idFromUrl} name={topic.name} />
            ))}
          </div>
        </div>
      </div>
      <div className={blockClassName}>
        <Heading level={2} className='text-base mb-4'>
          {t('TEXT_OTHER_CONVERSATIONS')}
        </Heading>
        {otherConversations.map((conversation) => (
          <div key={conversation.idFromUrl} className='flex gap-2'>
            <p className='text-text-secondary min-w-[90px]'>
              {formatDate(conversation.date, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}
            </p>
            <a>{conversation.title}</a>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
