'use client';

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { firebaseAuth } from '../firebase-auth';
import { authActions } from '../slice';

export function useLogin(onSuccess: () => void): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const loginByEmail = async (email: string, password: string, shouldRemember: boolean): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);

      const persistence = shouldRemember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(firebaseAuth, persistence);
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);

      dispatch(authActions.setProfile(response.user));
      const expirationDate = DateTime.local().plus({ day: 14 }).toJSDate();
      CookieService.set({ isAuthenticated: 'true' }, { expires: shouldRemember ? expirationDate : undefined });
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
