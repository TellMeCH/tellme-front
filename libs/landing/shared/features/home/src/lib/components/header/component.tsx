'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';
import { Icon, Logo } from '@tellme/shared/ui/ui-kit';
import { Menu } from '../menu';
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
      <Menu
        className={clsx(styles.header__menu, isMobileMenuOpen && styles.header__menu_open)}
        itemClassName='hover:underline hover:decoration-background-secondary hover:underline-offset-4 max-lg:text-lg max-lg:font-bold'
        onItemClick={closeMobileMenu}
      />
    </header>
  );
}
