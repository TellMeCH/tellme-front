'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { DividerWithText, Heading, Logo } from '@tellme/web/shared/ui/ui-kit';
import styles from './component.module.scss';
import { GoogleButton, MicrosoftButton } from './components';
import { LoginFormSchema } from './forms';

export function Login(): ReactElement {
  const t = useTranslations('account.LOGIN');

  const formSchema = new LoginFormSchema();
  /*const form = useForm({
    defaultValues: formSchema.formValues,
    resolver: yupResolver(LoginFormSchema.validationSchema)
  });*/

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
        <div className='flex flex-col gap-6'>
          <GoogleButton />
          <MicrosoftButton />
          <DividerWithText text={t('TEXT_OR')} />
        </div>
      </main>
    </div>
  );
}
