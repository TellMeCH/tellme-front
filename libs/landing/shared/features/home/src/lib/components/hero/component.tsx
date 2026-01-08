import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import { ContactButton } from '../contact-button';
import styles from './component.module.scss';

export function Hero(): ReactElement {
  const t = useTranslations('landing-shared.HOME.HERO');

  return (
    <div
      className={clsx(
        styles.hero,
        'h-[858px] flex items-center pb-8 max-lg:items-start max-lg:text-background-secondary max-lg:h-[770px] max-lg:flex-col',
      )}>
      <div className='container max-lg:flex-1 max-lg:flex'>
        <div className='max-w-[440px] max-xl:max-w-[485px] max-lg:max-w-none max-sm:flex max-sm:flex-col max-sm:flex-1'>
          <div className='max-lg:flex-1'>
            <Heading className='mb-6 max-lg:mb-4'>{t('TEXT_TITLE')}</Heading>
            <p className='mb-12 max-lg:mb-8'>{t('TEXT_APP_DESCRIPTION')}</p>
          </div>
          <ContactButton />
        </div>
      </div>
    </div>
  );
}
