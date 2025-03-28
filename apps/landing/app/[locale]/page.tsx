import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';

export default function Index(): ReactElement {
  const t = useTranslations('landing-shared.HOME_PAGE');

  return <div>{t('HOME_PAGE_TEXT')}</div>;
}
