import { ReactElement } from 'react';
import { useLogin } from '@tellme/web/shared/data-access/auth';
import { SocialProvider } from '../../enums';
import { SocialButton } from '../social-button';

interface GoogleButtonProps {
  onSuccess: () => void;
}

export function GoogleButton({ onSuccess }: GoogleButtonProps): ReactElement {
  const { loginByGoogle, isLoading } = useLogin(onSuccess);

  return <SocialButton
    provider={SocialProvider.GOOGLE}
    onPress={loginByGoogle}
    isLoading={isLoading} />;
}
