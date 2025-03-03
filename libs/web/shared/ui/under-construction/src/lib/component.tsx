'use client';

import { useTranslations } from 'next-intl';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import type { ReactElement } from 'react';

export function UnderConstruction(): ReactElement {
  const t = useTranslations('web-shared.UNDER_CONSTRUCTION');

  return (
    <div className='h-full flex flex-col justify-center items-center py-16 m-auto'>
      <Heading level={2}>{t('TEXT_TITLE')}</Heading>
      <p>{t('TEXT_DESCRIPTION')}</p>
    </div>
  );
}
