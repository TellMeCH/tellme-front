import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';

export default function Index(): ReactElement {
  const t = useTranslations('web-shared.HOME_PAGE');

  const nextpublicappenv = process.env.NEXT_PUBLIC_APP_ENV;

  return <div>{nextpublicappenv}</div>;
}
