'use client';

import { useDisclosure } from '@heroui/react';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { Topic, topicApi } from '@tellme/web/shared/data-access/api';
import { ConfirmationModal, Heading, Icon, Switch } from '@tellme/web/shared/ui/ui-kit';
import { formatDate } from '@tellme/web/shared/utils/dates';
import { FormModal } from '../form-modal';

interface ItemProps {
  topic: Topic;
}

export function Item({ topic }: ItemProps): ReactElement {
  const t = useTranslations('topic.MANAGEMENT');
  const { isOpen: isFormModalOpen, onOpenChange: onFormModalOpenChange } = useDisclosure();
  const { isOpen: isConfirmationModalOpen, onOpenChange: onConfirmationModalOpenChange } = useDisclosure();

  const [isActive, setIsActive] = useState(topic.isActive);

  const [update] = topicApi.useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = topicApi.useDeleteMutation();

  const removeTopic = async (): Promise<void> => {
    await remove(topic.id);
    onConfirmationModalOpenChange();
  };

  const updateTopicWithDebounce = useCallback(
    debounce((isActive: boolean) => update({ id: topic.id, isActive }), 400),
    [topic],
  );

  const changeActivity = (value: boolean): void => {
    setIsActive(value);
    updateTopicWithDebounce(value);
  };

  return (
    <div className='flex items-start py-4 border-b border-text-tertiary' data-testid='item'>
      <Switch
        isSelected={isActive}
        onValueChange={changeActivity}
        className='mr-6'
        data-testid='activity-switch' />
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
          onPress={onFormModalOpenChange}
          variant='bordered'
          isIconOnly
          startContent={<Icon name='pen' />}
          data-testid='update-modal-button'
        />
        <Button
          onPress={onConfirmationModalOpenChange}
          variant='bordered'
          color='danger'
          isIconOnly
          startContent={<Icon name='trash' />}
          data-testid='confirmation-modal-button'
        />
      </div>
      <FormModal
        isOpen={isFormModalOpen}
        onOpenChange={onFormModalOpenChange}
        topic={topic} />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onOpenChange={onConfirmationModalOpenChange}
        title={t('TEXT_DELETE_TOPIC_TITLE')}
        description={t.rich('TEXT_DELETE_TOPIC_DESCRIPTION', {
          name: topic.name,
          highlight: (chunks) => <strong>{chunks}</strong>,
        })}
        onConfirm={removeTopic}
        isLoading={isDeleting}
        confirmationButtonText={t('BUTTON_DELETE')}
      />
    </div>
  );
}
