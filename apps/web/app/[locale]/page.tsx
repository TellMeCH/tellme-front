import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';

export default function Index(): ReactElement {
  const t = useTranslations('web-shared.HOME_PAGE');

  return (
    <div className='w-[400px] flex flex-col gap-4'>
      <div className='text-center'>{t('HOME_PAGE_TEXT')}</div>
      <Button color='primary'>HeroUI Button</Button>
    </div>
  );
}
