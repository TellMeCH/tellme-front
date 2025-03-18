'use client';

import clsx from 'clsx';
import { debounce } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { ReactElement, useCallback, useState } from 'react';
import { Topic, topicApi } from '@tellme/web/shared/data-access/api';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Button, Heading, Icon, Switch } from '@tellme/web/shared/ui/ui-kit';
import { formatDate } from '@tellme/web/shared/utils/dates';

interface ItemProps {
  topic: Topic;
}

export function Item({ topic }: ItemProps): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');
  const showUnderDevelopment = useShowUnderDevelopment();

  const [isActive, setIsActive] = useState(topic.isActive);

  const [update] = topicApi.useUpdateMutation();

  const updateTopicWithDebounce = useCallback(
    debounce((isActive: boolean) => update({ id: topic.id, isActive }), 400),
    [topic],
  );

  const changeActivity = (value: boolean): void => {
    setIsActive(value);
    updateTopicWithDebounce(value);
  };

  return (
    <div className='flex items-start py-4 border-b border-text-tertiary'>
      <Switch
        isSelected={isActive}
        onValueChange={changeActivity}
        className='mr-6' />
      <div className={clsx('flex-1 mr-[9%]', !isActive && 'text-text-secondary')}>
        <Heading level={2} className='mb-2 text-xl font-medium'>
          {topic.name}
        </Heading>
        <p>{topic.description}</p>
      </div>
      <div className={clsx('text-sm mr-[9%] min-w-[180px]', !isActive && 'text-text-secondary')}>
        <p className='mb-1'>{t('TEXT_LAST_MODIFIED', { date: formatDate(topic.updated) })}</p>
        <p>{t('TEXT_CREATED', { date: formatDate(topic.created) })}</p>
      </div>
      <div className='flex gap-2'>
        <Button
          onPress={showUnderDevelopment}
          variant='bordered'
          isIconOnly
          startContent={<Icon name='pen' />} />
        <Button
          onPress={showUnderDevelopment}
          variant='bordered'
          color='danger'
          isIconOnly
          startContent={<Icon name='trash' />}
        />
      </div>
    </div>
  );
}
