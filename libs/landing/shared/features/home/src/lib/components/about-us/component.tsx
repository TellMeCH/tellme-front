import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import { Icon } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';
import styles from './component.module.scss';

export function AboutUs(): ReactElement {
  const t = useTranslations('landing-shared.HOME.ABOUT_US');

  return (
    <section className={clsx(styles.aboutus, 'section text-background-primary')} id={HomeSectionId.ABOUT_US}>
      <div className='container flex flex-col gap-[3.75rem] max-lg:gap-10'>
        <div className='flex items-center gap-6 max-lg:gap-4'>
          <Heading level={2} className='!text-lg'>
            {t('TEXT_ABOUT_US')}
          </Heading>
          <Icon name='switzerland' className='origin-center max-lg:scale-80' />
        </div>
        <div className='flex gap-20 max-lg:gap-10 max-lg:flex-col'>
          <p className='text-h1/[1.1] max-lg:text-h1-mobile flex-1'>
            <strong>{t('TEXT_GOAL')}</strong>
          </p>
          <p className='flex-1'>{t('TEXT_GOAL_DESCRIPTION')}</p>
        </div>
        <div className='flex gap-20 max-lg:gap-10 max-lg:flex-col'>
          <div className='flex-1'>
            <p>
              <strong>{t('TEXT_EXPERTISE_TITLE')}</strong>
            </p>
            <p>{t('TEXT_EXPERTISE_DESCRIPTION')}</p>
          </div>
          <div className='flex-1'>
            <p>
              <strong>{t('TEXT_VALUES_TITLE')}</strong>
            </p>
            <p>{t('TEXT_VALUES_DESCRIPTION')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
