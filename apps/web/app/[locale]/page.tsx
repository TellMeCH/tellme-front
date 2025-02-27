import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading, Icon, Logo } from '@tellme/web/shared/ui/ui-kit';

export default function Index(): ReactElement {
  const t = useTranslations('web-shared.HOME_PAGE');

  return (
    <div className='w-[400px] flex flex-col gap-4'>
      <Heading level={1} className='text-center'>
        Heading example
      </Heading>
      <Logo />
      <Logo type='short' />
      <Icon name='facebook' theme='tertiary' />
      <div className='text-center'>{t('HOME_PAGE_TEXT')}</div>
      <Button color='primary'>HeroUI Button</Button>
    </div>
  );
}
