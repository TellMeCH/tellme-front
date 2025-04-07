'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button, FormMessage } from '@tellme/shared/ui/ui-kit';
import { Topic, topicApi } from '@tellme/web/shared/data-access/api';
import { FormSwitch, FormTextarea, FormTextInput, Modal } from '@tellme/web/shared/ui/ui-kit';
import { FormValues } from '@tellme/web/shared/utils/form';
import { TopicFormSchema } from '../../forms';

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  topic?: Topic;
}

export function FormModal({ topic, isOpen, onOpenChange }: FormModalProps): ReactElement {
  const isForEdit = !!topic;
  const t = useTranslations('topic.MANAGEMENT.FORM_MODAL');

  const [update, { isLoading: isUpdating, error: updateError, isSuccess: wasUpdatedSuccessfully }] =
    topicApi.useUpdateMutation();
  const [create, { isLoading: isCreating, error: creationError, isSuccess: wasCreatedSuccessfully }] =
    topicApi.useCreateMutation();

  const isSuccess = wasCreatedSuccessfully || wasUpdatedSuccessfully;
  const hasError = updateError || creationError;

  const formSchema = new TopicFormSchema(topic);
  const form = useForm({
    defaultValues: formSchema.formValues,
    resolver: yupResolver(TopicFormSchema.validationSchema(t)),
  });
  const values = useWatch({ control: form.control });

  const submit = (values: FormValues<TopicFormSchema>): void => {
    if (isForEdit) {
      update({ id: topic.id, ...values });
    } else {
      create(values);
    }
  };

  const close = (): void => {
    onOpenChange();
    form.reset({ isActive: false, name: '', description: '' });
  };

  useEffect(() => {
    if (isOpen && topic) {
      form.reset({ name: topic.name, description: topic.description, isActive: topic.isActive });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (hasError) {
      const hasUniqueNameError =
        updateError?.data.nonFieldErrors?.includes('The fields name, organization must make a unique set.') ||
        creationError?.data.name?.includes('A topic with this same name already exists in this Organization.');

      if (hasUniqueNameError) {
        form.setError('name', { message: t('TEXT_UNIQUE_NAME') });
      }
    }
  }, [hasError]);

  return (
    <Modal
      size='2xl'
      isOpen={isOpen}
      onClose={close}
      onSubmit={form.handleSubmit(submit)}
      title={isForEdit ? t('TEXT_EDIT_TOPIC') : t('TEXT_CREATE_TOPIC')}
      footerContent={
        <Fragment>
          <Button
            variant='bordered'
            onPress={close}
            className='flex-1'>
            {t('BUTTON_CANCEL')}
          </Button>
          <Button
            type='submit'
            isDisabled={!values.name || !values.description}
            isLoading={isUpdating || isCreating}
            className='flex-1'
            data-testid='submit-button'>
            {t('BUTTON_SAVE')}
          </Button>
        </Fragment>
      }>
      {!isForEdit && (
        <FormSwitch
          name='isActive'
          control={form.control}
          className='mb-3'
          data-testid='creation-activity-switch'>
          {t('TEXT_ACTIVATE_FOR_ANALYSIS')}
        </FormSwitch>
      )}
      <FormTextInput
        name='name'
        control={form.control}
        label={t('TEXT_TOPIC_NAME')}
        placeholder={t('TEXT_NAME')}
        data-testid='name-input'
      />
      <FormTextarea
        name='description'
        control={form.control}
        label={t('TEXT_DESCRIPTION')}
        placeholder={t('TEXT_DESCRIPTION')}
        data-testid='description-input'
      />
      {creationError?.data.nonFieldErrors?.includes(
        'Cannot add more topics to this organization; max topic count reached.',
      ) && <FormMessage message={t('TEXT_TOPICS_LIMIT')} />}
    </Modal>
  );
}
