import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Logo } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';

export function Header(): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <header className='absolute w-full px-10 py-6 flex justify-between items-center'>
      <Logo />
      <nav className='flex gap-16 items-center max-xl:gap-8'>
        {Object.entries(HomeSectionId).map(([key, value]) => (
          <Link
            key={key}
            href={`#${value}`}
            className='text-sm text-text-tertiary hover:underline hover:decoration-background-secondary hover:underline-offset-4'>
            {t(`LINK_${key}`)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
