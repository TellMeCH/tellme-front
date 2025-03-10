import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { SocialProviderName } from '@tellme/web/shared/data-access/auth';
import { Button, Icon } from '@tellme/web/shared/ui/ui-kit';

interface SocialButtonProps {
  providerName: SocialProviderName;
  onPress: () => void;
  isLoading?: boolean;
}

export function SocialButton({ providerName, onPress, isLoading }: SocialButtonProps): ReactElement {
  const t = useTranslations('account.LOGIN');

  return (
    <Button
      onPress={onPress}
      isLoading={isLoading}
      variant='bordered'
      fullWidth
      startContent={<Icon name={providerName} />}>
      <span className='text-text-primary font-medium'>{t(`BUTTON_${providerName.toUpperCase()}`)}</span>
    </Button>
  );
}
