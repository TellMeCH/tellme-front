import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Topic, topicApi } from '@tellme/web/shared/data-access/api';
import { Button, FormSwitch, FormTextarea, FormTextInput, Modal } from '@tellme/web/shared/ui/ui-kit';
import { FormValues } from '@tellme/web/shared/utils/form';
import { TopicFormSchema } from '../../forms';

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  topic?: Topic;
}

export function FormModal({ topic, isOpen, onOpenChange }: FormModalProps): ReactElement {
  const isForEdit = !!topic;
  const t = useTranslations('topic.MANAGEMENT');

  const [update, { isLoading: isUpdating }] = topicApi.useUpdateMutation();
  const [create, { isLoading: isCreating }] = topicApi.useCreateMutation();

  const formSchema = new TopicFormSchema(topic);
  const form = useForm({
    defaultValues: formSchema.formValues,
    resolver: yupResolver(TopicFormSchema.validationSchema(t)),
  });
  const values = useWatch({ control: form.control });

  const submit = async (values: FormValues<TopicFormSchema>): Promise<void> => {
    if (isForEdit) {
      await update({ id: topic.id, ...values });
    } else {
      await create(values);
    }

    onOpenChange();
  };

  return (
    <Modal
      size='2xl'
      isOpen={isOpen}
      onClose={onOpenChange}
      onSubmit={form.handleSubmit(submit)}
      title={isForEdit ? t('TEXT_EDIT_TOPIC') : t('TEXT_CREATE_TOPIC')}
      footerContent={
        <Fragment>
          <Button
            variant='bordered'
            onPress={onOpenChange}
            className='flex-1'>
            {t('BUTTON_CANCEL')}
          </Button>
          <Button
            type='submit'
            isDisabled={!values.name || !values.description}
            isLoading={isUpdating || isCreating}
            className='flex-1'>
            {t('BUTTON_SAVE')}
          </Button>
        </Fragment>
      }>
      {!isForEdit && (
        <FormSwitch
          name='isActive'
          control={form.control}
          className='mb-3'>
          {t('TEXT_ACTIVATE_FOR_ANALYSIS')}
        </FormSwitch>
      )}
      <FormTextInput
        name='name'
        control={form.control}
        label={t('TEXT_TOPIC_NAME')}
        placeholder={t('TEXT_NAME')} />
      <FormTextarea
        name='description'
        control={form.control}
        label={t('TEXT_DESCRIPTION')}
        placeholder={t('TEXT_DESCRIPTION')}
      />
    </Modal>
  );
}
