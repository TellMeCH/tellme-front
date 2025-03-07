'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { firebaseAuth } from '../firebase-auth';
import { authActions } from '../slice';

export function useLogin(onSuccess: () => void): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const loginByEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
      dispatch(authActions.setProfile(response.user));

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
