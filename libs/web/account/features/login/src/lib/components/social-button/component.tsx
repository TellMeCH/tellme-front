import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { ErrorResponse } from '@tellme/web/shared/data-access/api';
import { checkIsApiError } from '@tellme/web/shared/data-access/api-client';
import { SocialProviderName } from '@tellme/web/shared/data-access/auth';
import { Button, FormMessage, Icon } from '@tellme/web/shared/ui/ui-kit';

interface SocialButtonProps {
  providerName: SocialProviderName;
  onPress: () => void;
  isLoading?: boolean;
  error?: ErrorResponse<any>;
  testId?: string;
}

export function SocialButton({ providerName, onPress, isLoading, error, testId }: SocialButtonProps): ReactElement {
  const t = useTranslations('account.LOGIN');

  return (
    <div>
      <Button
        onPress={onPress}
        isLoading={isLoading}
        variant='bordered'
        fullWidth
        startContent={<Icon name={providerName} />}
        data-testid={testId}>
        <span className='text-text-primary font-medium'>{t(`BUTTON_${providerName.toUpperCase()}`)}</span>
      </Button>
      {!!error && (
        <FormMessage
          message={
            checkIsApiError(error)
              ? error.data.detail
              : error.message.includes('auth/admin-restricted-operation')
                ? t('TEXT_IMPOSSIBLE_TO_LOG_IN')
                : t('TEXT_INTERNAL_ERROR')
          }
          className='mt-1'
        />
      )}
    </div>
  );
}
