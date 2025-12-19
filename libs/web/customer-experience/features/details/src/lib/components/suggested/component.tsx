import { Tab } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Key, ReactElement, useState } from 'react';
import { CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Tabs } from '@tellme/web/shared/ui/ui-kit';
import { SuggestedTabKey } from '../../enums';
import { SuggestedEmail } from '../suggested-email';

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
      <div className='w-[190px] absolute right-8 top-6'>
        <Tabs
          selectedKey={selectedTabKey}
          onSelectionChange={changeTabKey}
          fullWidth>
          <Tab key={SuggestedTabKey.EMAIL} title={t('TEXT_EMAIL')} />
          <Tab key={SuggestedTabKey.JIRA} title={t('TEXT_JIRA')} />
        </Tabs>
      </div>
      {selectedTabKey === SuggestedTabKey.EMAIL ? <SuggestedEmail summary={summary} /> : null}
    </div>
  );
}
