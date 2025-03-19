'use client';

import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { topicApi, organizationApi } from '@tellme/web/shared/data-access/api';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { firebaseAuth } from '../firebase-auth';

export function useLogout(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const logout = async (): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      await signOut(firebaseAuth);

      CookieService.remove(['isAuthenticated']);
      dispatch(topicApi.util.resetApiState());
      dispatch(organizationApi.util.resetApiState());

      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const result = { isLoading, error, logout };

  return result;
}
