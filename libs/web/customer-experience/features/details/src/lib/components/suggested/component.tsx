import { As, Tab } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Key, ReactElement, useState } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';
import { Customer, CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Tabs } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { SuggestedTabKey } from '../../enums';
import { useTicket } from '../../hooks';
import { SuggestedContent } from '../suggested-content';

interface SuggestedProps {
  customer: Customer;
  summary?: CustomerSummary;
  hasTabs?: boolean;
}

export function Suggested({ customer, summary, hasTabs }: SuggestedProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.SUGGESTED');
  const [selectedTabKey, setSelectedTabKey] = useState(SuggestedTabKey.EMAIL);

  const { createTicket, isLoading, isError } = useTicket(customer.idFromUrl);

  const changeTabKey = (key: Key) => {
    setSelectedTabKey(key as SuggestedTabKey);
  };

  const isEmailSelected = selectedTabKey === SuggestedTabKey.EMAIL;
  const title = isEmailSelected
    ? t('TEXT_EMAIL_TITLE')
    : customer.hasTicket
      ? t('TEXT_TICKET')
      : t('TEXT_SUGGESTED_TICKET');
  const subtitle = isEmailSelected
    ? summary?.suggestedEmailSubject
    : `${summary?.jiraTicketTitle}${customer.ticketDate ? `, ${formatDate(customer.ticketDate, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}` : ''}`;
  const description = isEmailSelected ? summary?.suggestedEmailBody : summary?.jiraTicketBody;
  const generatingText = isEmailSelected ? t('TEXT_GENERATING_EMAIL') : t('TEXT_GENERATING_SUGGESTED_TICKET');
  const buttonProps = isEmailSelected
    ? {
        as: 'a' as As,
        href: summary?.suggestedEmailLink,
        target: '_blank',
        startContent: <Icon name='email' theme='brand_primary' />,
        children: t('BUTTON_SEND_EMAIL'),
      }
    : {
        onClick: customer.hasTicket ? undefined : createTicket,
        as: customer.hasTicket ? ('a' as As) : undefined,
        target: customer.hasTicket ? '_blank' : undefined,
        href: customer.ticketLink || undefined,
        isLoading,
        children: isLoading
          ? t('BUTTON_CREATING_TICKET')
          : customer.hasTicket
            ? t('BUTTON_VIEW_TICKET')
            : t('BUTTON_CREATE_TICKET'),
        isDisabled: isLoading,
        startContent: isLoading ? undefined : <Icon name='file' theme='brand_primary' />,
      };

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8 relative'>
      {hasTabs && (
        <div className='w-[190px] absolute right-8 top-6'>
          <Tabs
            selectedKey={selectedTabKey}
            onSelectionChange={changeTabKey}
            fullWidth>
            <Tab key={SuggestedTabKey.EMAIL} title={t('TEXT_EMAIL')} />
            <Tab key={SuggestedTabKey.JIRA} title={t('TEXT_JIRA')} />
          </Tabs>
        </div>
      )}
      <SuggestedContent
        title={title}
        subtitle={subtitle}
        description={description}
        generatingText={generatingText}
        buttonProps={buttonProps}
        error={isError ? t('TEXT_SOMETHING_WENT_WRONG') : undefined}
      />
    </div>
  );
}
