'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { firebaseAuth } from '../firebase-auth';

export function useLogin(onSuccess: () => void): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loginByEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithEmailAndPassword(firebaseAuth, email, password);

      CookieService.set({ isAuthenticated: 'true' });
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const result = { isLoading, error, loginByEmail };

  return result;
}
