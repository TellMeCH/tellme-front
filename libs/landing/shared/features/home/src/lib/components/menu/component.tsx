import clsx from 'clsx';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { HomeSectionId } from '../../enums';

interface MenuProps {
  className?: string;
  itemClassName?: string;
  onItemClick?: () => void;
}

export function Menu({ className, itemClassName, onItemClick }: MenuProps): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <nav className={clsx('flex items-center gap-16 max-xl:gap-8 max-lg:flex-col max-lg:items-start', className)}>
      {Object.entries(HomeSectionId).map(([key, value]) => (
        <Link
          key={key}
          href={`#${value}`}
          onClick={onItemClick}
          className={clsx(itemClassName, 'text-sm text-text-tertiary')}>
          {t(`LINK_${key}`)}
        </Link>
      ))}
    </nav>
  );
}
