import { ReactElement } from 'react';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { SocialProvider } from '../../enums';
import { SocialButton } from '../social-button';

export function MicrosoftButton(): ReactElement {
  // TODO: implement login with Microsoft
  const showUnderDevelopment = useShowUnderDevelopment();

  return <SocialButton provider={SocialProvider.MICROSOFT} onPress={showUnderDevelopment} />;
}
