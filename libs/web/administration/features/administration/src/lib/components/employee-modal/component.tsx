'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { capitalize, isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@tellme/shared/ui/ui-kit';
import { employeeApi, EmployeeAuthType, EmployeeRole, EmployeeUser } from '@tellme/web/shared/data-access/api';
import { FormSelect, FormSwitch, FormTextInput, Modal } from '@tellme/web/shared/ui/ui-kit';
import { FormValues } from '@tellme/web/shared/utils/form';
import { EmployeeFormSchema } from '../../forms';
import { useAuthTypeTranslation, useEmployeeRoleTranslation } from '../../hooks';

interface EmployeeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function EmployeeModal({ isOpen, onOpenChange }: EmployeeModalProps): ReactElement {
  const t = useTranslations('administration.ADMINISTRATION.EMPLOYEE_MODAL');
  const translateRole = useEmployeeRoleTranslation();
  const translateAuthType = useAuthTypeTranslation();

  const [create, { isLoading, error, isSuccess }] = employeeApi.useCreateMutation();

  const formSchema = new EmployeeFormSchema();
  const form = useForm({
    defaultValues: formSchema.formValues,
    resolver: yupResolver(EmployeeFormSchema.validationSchema(t)),
  });

  const submit = (values: FormValues<EmployeeFormSchema>): void => {
    create({
      ...values,
      user: new EmployeeUser(values.user),
    });
  };
  useEffect(() => {
    if (isSuccess) {
      onOpenChange();
      form.reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    const emailError = error?.data.user?.email;

    if (emailError) {
      form.setError('user.email', { message: capitalize(emailError[0]) });
    }
  }, [error]);

  return (
    <Modal
      size='xl'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onOpenChange}
      onSubmit={form.handleSubmit(submit)}
      title={t('TEXT_TITLE')}
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
            isDisabled={!isEmpty(form.formState.errors)}
            isLoading={isLoading}
            className='flex-1'>
            {t('BUTTON_SAVE')}
          </Button>
        </Fragment>
      }>
      <div className='flex gap-3'>
        <FormTextInput
          name='user.firstName'
          control={form.control}
          label={t('TEXT_FIRST_NAME')}
          placeholder={t('TEXT_FIRST_NAME')}
        />
        <FormTextInput
          name='user.lastName'
          control={form.control}
          label={t('TEXT_LAST_NAME')}
          placeholder={t('TEXT_LAST_NAME')}
        />
      </div>
      <FormTextInput
        name='user.email'
        control={form.control}
        label={t('TEXT_EMAIL')}
        placeholder={t('TEXT_EMAIL')} />
      <FormSelect
        name='user.authType'
        control={form.control}
        options={Object.entries(EmployeeAuthType).map(([_, value]) => ({
          key: value,
          title: translateAuthType(value),
        }))}
        label={t('TEXT_AUTHENTICATION_TYPE')}
      />
      <FormSelect
        name='role'
        control={form.control}
        options={Object.entries(EmployeeRole).map(([_, value]) => ({ key: value, title: translateRole(value) }))}
        label={t('TEXT_ROLE')}
      />
      <FormSwitch
        className='mt-5 mb-2'
        name='isOrganizationAdmin'
        control={form.control}>
        {t('TEXT_GIVE_ADMIN_PERMISSIONS')}
      </FormSwitch>
    </Modal>
  );
}
