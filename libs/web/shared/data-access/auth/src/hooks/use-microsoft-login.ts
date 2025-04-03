import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../firebase-auth';
import { useLogin } from './use-login';

const microsoftProvider = new OAuthProvider('microsoft.com');

export function useMicrosoftLogin(onSuccess: () => void) {
  const { isLoading, error, executeLogin } = useLogin(onSuccess);

  const loginByMicrosoft = async (): Promise<void> => {
    await executeLogin(async () => await signInWithPopup(firebaseAuth, microsoftProvider));
  };

  return { isLoading, error, loginByMicrosoft };
}
