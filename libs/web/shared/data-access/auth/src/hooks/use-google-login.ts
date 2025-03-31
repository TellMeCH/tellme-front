import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../firebase-auth';
import { useLogin } from './use-login';

const googleProvider = new GoogleAuthProvider();

export function useGoogleLogin(onSuccess: () => void) {
  const { isLoading, error, executeLogin } = useLogin(onSuccess);

  const loginByGoogle = async (): Promise<void> => {
    await executeLogin(async () => await signInWithPopup(firebaseAuth, googleProvider));
  };

  return { isLoading, error, loginByGoogle };
}
