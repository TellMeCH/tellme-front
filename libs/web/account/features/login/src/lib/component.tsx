'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Button, DividerWithText, FormTextInput, Heading, Icon, Logo } from '@tellme/web/shared/ui/ui-kit';
import styles from './component.module.scss';
import { GoogleButton, MicrosoftButton } from './components';
import { LoginFormSchema } from './forms';

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps): ReactElement {
  const t = useTranslations('account.LOGIN');

  const formSchema = new LoginFormSchema();
  const form = useForm({
    defaultValues: formSchema.formValues,
    resolver: yupResolver(LoginFormSchema.validationSchema(t)),
  });

  // TODO: implement login with email and password
  const submit = (): void => onSuccess();

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
      <main className='bg-background-secondary w-[35%] max-w-[500px] rounded-3xl p-[40px]'>
        <div className='mb-14'>
          <Logo />
        </div>
        <Heading level={1} className={clsx(styles.login__title, 'mb-2')}>
          {t('TEXT_TITLE')}
          <span className='text-brand-secondary'>{t('TEXT_ME')}</span>
        </Heading>
        <p className='mb-6'>{t('TEXT_DESCRIPTION')}</p>
        <div className='flex flex-col gap-6 mb-6'>
          <GoogleButton />
          <MicrosoftButton />
          <DividerWithText text={t('TEXT_OR')} />
        </div>
        <form onSubmit={form.handleSubmit(submit)} className='flex flex-col gap-6 '>
          <FormTextInput
            name='email'
            control={form.control}
            label={t('TEXT_EMAIL')}
            placeholder={t('TEXT_EMAIL')}
            accessoryLeft={<Icon name='mail' />}
            type='email'
            autoComplete='email'
          />
          <FormTextInput
            name='password'
            control={form.control}
            label={t('TEXT_PASSWORD')}
            placeholder={t('TEXT_PASSWORD')}
            accessoryLeft={<Icon name='lock' />}
            type='password'
            autoComplete='current-password'
          />
          <Button
            type='submit'
            isDisabled={!isEmpty(form.formState.errors)}
            fullWidth>
            {t('BUTTON_SIGN_IN')}
          </Button>
        </form>
      </main>
    </div>
  );
}
