import { ReactElement } from 'react';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { SocialProvider } from '../../enums';
import { SocialButton } from '../social-button';

export function GoogleButton(): ReactElement {
  // TODO: implement login with Google
  const showUnderDevelopment = useShowUnderDevelopment();

  return <SocialButton provider={SocialProvider.GOOGLE} onPress={showUnderDevelopment} />;
}
