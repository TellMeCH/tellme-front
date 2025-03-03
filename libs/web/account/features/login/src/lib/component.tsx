import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading, Logo } from '@tellme/web/shared/ui/ui-kit';
import styles from './component.module.scss';
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
      <main className='bg-background-secondary w-[35%] rounded-3xl p-[3.5%]'>
        <div className='mb-14'>
          <Logo />
        </div>
        <Heading level={1} className={clsx(styles.login__title, 'mb-2')}>
          {t('TEXT_TITLE')}
          <span className='text-brand-secondary'>{t('TEXT_ME')}</span>
        </Heading>
        <p>{t('TEXT_DESCRIPTION')}</p>
      </main>
    </div>
  );
}
