import { Tab } from '@heroui/react';
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
      {selectedTabKey === SuggestedTabKey.EMAIL ? (
        <SuggestedContent
          title={t('TEXT_EMAIL_TITLE')}
          subtitle={summary?.suggestedEmailSubject}
          description={summary?.suggestedEmailBody}
          generatingText={t('TEXT_GENERATING_EMAIL')}
          buttonProps={{
            as: 'a',
            href: summary?.suggestedEmailLink,
            target: '_blank',
            startContent: <Icon name='email' theme='brand_primary' />,
            children: t('BUTTON_SEND_EMAIL'),
          }}
        />
      ) : null}
    </div>
  );
}
