import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Conversation } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

interface OtherConversationsProps {
  conversations: Array<Conversation>;
  customerId: number;
}

export function OtherConversations({ conversations, customerId }: OtherConversationsProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.OTHER_CONVERSATIONS');

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <Heading level={2} className='text-base mb-4'>
        {t('TEXT_TITLE')}
      </Heading>
      {conversations.map((conversation) => (
        <div
          key={conversation.idFromUrl}
          className='flex gap-2 mb-4 last:mb-0 text-sm'
          data-testid='other-conversation-item'>
          <p className='text-text-secondary min-w-[90px]'>
            {formatDate(conversation.date, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}
          </p>
          <Link
            href={navigationConfig.routes.private.customerExperiences.view(customerId, conversation.idFromUrl)}
            className='underline text-brand-primary'>
            {conversation.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
