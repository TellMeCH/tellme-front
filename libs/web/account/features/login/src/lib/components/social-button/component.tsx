import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { SocialProviderName } from '@tellme/web/shared/data-access/auth';
import { Button, FormMessage, Icon } from '@tellme/web/shared/ui/ui-kit';

interface SocialButtonProps {
  providerName: SocialProviderName;
  onPress: () => void;
  isLoading?: boolean;
  error?: string;
}

export function SocialButton({ providerName, onPress, isLoading, error }: SocialButtonProps): ReactElement {
  const t = useTranslations('account.LOGIN');

  return (
    <div>
      <Button
        onPress={onPress}
        isLoading={isLoading}
        variant='bordered'
        fullWidth
        startContent={<Icon name={providerName} />}>
        <span className='text-text-primary font-medium'>{t(`BUTTON_${providerName.toUpperCase()}`)}</span>
      </Button>
      {!!error && (
        <FormMessage
          message={
            error.includes('auth/admin-restricted-operation')
              ? t('TEXT_IMPOSSIBLE_TO_LOG_IN')
              : t('TEXT_INTERNAL_ERROR')
          }
          className='mt-1'
        />
      )}
    </div>
  );
}
