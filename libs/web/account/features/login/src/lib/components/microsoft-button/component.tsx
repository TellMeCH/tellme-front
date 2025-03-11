import { ReactElement } from 'react';
import { SocialProviderName, useLogin } from '@tellme/web/shared/data-access/auth';
import { SocialButton } from '../social-button';

interface MicrosoftButtonProps {
  onSuccess: () => void;
}

export function MicrosoftButton({ onSuccess }: MicrosoftButtonProps): ReactElement {
  const { loginBySocial, isLoading, error } = useLogin(onSuccess);

  const loginByMicrosoft = (): void => {
    loginBySocial(SocialProviderName.MICROSOFT);
  };

  return (
    <SocialButton
      providerName={SocialProviderName.MICROSOFT}
      onPress={loginByMicrosoft}
      isLoading={isLoading}
      error={error}
    />
  );
}
