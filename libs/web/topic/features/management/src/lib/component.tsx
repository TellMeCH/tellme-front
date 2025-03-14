'use client';

import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Button, Header, Icon } from '@tellme/web/shared/ui/ui-kit';
import { Item } from './components';

export function TopicsManagement(): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');
  const showUnderDevelopment = useShowUnderDevelopment();

  const profile = useSelector(authSelectors.profile);
  const { data, isFetching } = topicApi.useSearchQuery({}, { skip: !profile });

  return (
    <div>
      <Header
        title={t('TEXT_TITLE')}
        rightContent={
          <Button onPress={showUnderDevelopment} endContent={<Icon name='plus' />}>
            {t('BUTTON_NEW_TOPIC')}
          </Button>
        }
      />
      <div className='bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        {data?.results.map((topic) => <Item topic={topic} key={topic.id} />)}
      </div>
    </div>
  );
}
