import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { firebaseAuth } from '../firebase-auth';

export function useLogin(): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loginByEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await response.user.getIdToken();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const result = { isLoading, error, loginByEmail };

  return result;
}
