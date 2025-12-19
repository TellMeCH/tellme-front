import { As, Tab } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Key, ReactElement, useState } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';
import { CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Tabs } from '@tellme/web/shared/ui/ui-kit';
import { SuggestedTabKey } from '../../enums';
import { SuggestedContent } from '../suggested-content';

interface SuggestedProps {
  summary?: CustomerSummary;
  hasTabs?: boolean;
}

export function Suggested({ summary, hasTabs }: SuggestedProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.SUGGESTED');
  const [selectedTabKey, setSelectedTabKey] = useState(SuggestedTabKey.EMAIL);

  const isEmailSelected = selectedTabKey === SuggestedTabKey.EMAIL;
  const title = isEmailSelected ? t('TEXT_EMAIL_TITLE') : t('TEXT_SUGGESTED_TICKET');
  const subtitle = isEmailSelected ? summary?.suggestedEmailSubject : summary?.jiraTicketTitle;
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
        onClick: () => console.log('Create'),
        children: t('BUTTON_CREATE_TICKET'),
        startContent: <Icon name='file' theme='brand_primary' />,
      };

  const changeTabKey = (key: Key) => {
    setSelectedTabKey(key as SuggestedTabKey);
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
      />
    </div>
  );
}
