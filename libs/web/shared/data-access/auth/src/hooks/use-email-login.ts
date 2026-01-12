import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth } from '../firebase-auth';
import { useLogin } from './use-login';

export function useEmailLogin(onSuccess: () => void): typeof result {
  const { isLoading, error, executeLogin } = useLogin(onSuccess);

  const loginByEmail = async (email: string, password: string, shouldRemember: boolean): Promise<void> => {
    await executeLogin(async () => {
      const persistence = shouldRemember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(firebaseAuth, persistence);

      return await signInWithEmailAndPassword(firebaseAuth, email, password);
    }, shouldRemember);
  };

  const result = { isLoading, error, loginByEmail };

  return result;
}
