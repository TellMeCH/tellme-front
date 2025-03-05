import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button, Icon } from '@tellme/web/shared/ui/ui-kit';
import { SocialProvider } from '../../enums';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

export function SocialButton({ provider, onPress }: SocialButtonProps): ReactElement {
  const t = useTranslations('account.LOGIN');

  return (
    <Button
      onPress={onPress}
      variant='bordered'
      fullWidth
      startContent={<Icon name={provider} />}>
      <span className='text-text-primary font-medium'>{t(`BUTTON_${provider.toUpperCase()}`)}</span>
    </Button>
  );
}
