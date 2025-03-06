import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { firebaseAuth } from '../firebase-auth';

export function useLogin(onSuccess: () => void): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loginByEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await response.user.getIdToken();
      onSuccess();
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const result = { isLoading, error, loginByEmail };

  return result;
}
