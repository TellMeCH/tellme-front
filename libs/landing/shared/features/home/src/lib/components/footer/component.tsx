import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Logo } from '@tellme/shared/ui/ui-kit';
import { Menu } from '../menu';

export function Footer(): ReactElement {
  const t = useTranslations('landing-shared.HOME.FOOTER');

  return (
    <footer className='pt-10 pb-[100px] bg-footer-background max-lg:py-10'>
      <div className='container'>
        <div className='flex justify-between items-start mb-6 max-sm:flex-col max-sm:gap-10 max-sm:mb-10'>
          <div className='max-w-[264px] text-medium text-background-primary'>
            <Logo type='light' className='mb-6' />
            <p>{t('TEXT_FOOTER_DESCRIPTION')}</p>
          </div>
          <Menu className='gap-20 max-lg:gap-4' />
        </div>
        <div className='text-text-secondary text-sm text-right max-sm:text-left'>
          {t('TEXT_COPYRIGHT', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
