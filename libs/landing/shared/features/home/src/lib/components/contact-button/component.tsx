'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';

export function ContactButton(): ReactElement {
  const t = useTranslations('landing-shared.HOME.HERO');

  return (
    <Button
      color='secondary'
      as={Link}
      href={`#${HomeSectionId.CONTACT_US}`}
      size='lg'>
      {t('BUTTON_BOOK_DEMO_CALL')}
    </Button>
  );
}
