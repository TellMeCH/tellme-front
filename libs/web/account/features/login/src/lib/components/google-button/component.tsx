import { ReactElement } from 'react';
import { SocialProviderName, useLogin } from '@tellme/web/shared/data-access/auth';
import { SocialButton } from '../social-button';

interface GoogleButtonProps {
  onSuccess: () => void;
}

export function GoogleButton({ onSuccess }: GoogleButtonProps): ReactElement {
  const { loginBySocial, isLoading } = useLogin(onSuccess);

  const loginByGoogle = (): void => {
    loginBySocial(SocialProviderName.GOOGLE);
  };

  return <SocialButton
    providerName={SocialProviderName.GOOGLE}
    onPress={loginByGoogle}
    isLoading={isLoading} />;
}
