'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';
import { Icon, Logo } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';
import styles from './component.module.scss';

export function Header(): ReactElement {
  const t = useTranslations('landing-shared.HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((value) => !value);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className='absolute w-full px-10 py-6 flex justify-between items-center max-lg:px-4 max-lg:py-2'>
      <Logo className='max-lg:hidden' />
      <Logo type='light' className='lg:hidden' />
      <button
        onClick={toggleMobileMenu}
        className='lg:hidden'
        aria-label={isMobileMenuOpen ? t('BUTTON_CLOSE_MENU') : t('BUTTON_OPEN_MENU')}>
        <Icon name={isMobileMenuOpen ? 'cross' : 'menu_lines'} theme='bg_primary' />
      </button>
      <nav className={clsx(styles.header__menu, isMobileMenuOpen && styles.header__menu_open)}>
        {Object.entries(HomeSectionId).map(([key, value]) => (
          <Link
            key={key}
            href={`#${value}`}
            onClick={closeMobileMenu}
            className='text-sm text-text-tertiary hover:underline hover:decoration-background-secondary hover:underline-offset-4 max-lg:text-lg max-lg:font-bold'>
            {t(`LINK_${key}`)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
