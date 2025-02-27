import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';

export default function Index(): ReactElement {
  const t = useTranslations('web-shared.HOME_PAGE');

  return (
    <div className='w-[400px] flex flex-col gap-4'>
      <Heading level={1} className='text-center'>
        Heading example
      </Heading>
      <div className='text-center'>{t('HOME_PAGE_TEXT')}</div>
      <Button color='primary'>HeroUI Button</Button>
    </div>
  );
}
