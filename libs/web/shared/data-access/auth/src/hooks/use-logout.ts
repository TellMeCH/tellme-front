'use client';

import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { firebaseAuth } from '../firebase-auth';

export function useLogout(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = async (): Promise<void> => {
    try {
      setError('');
      setIsLoading(true);
      await signOut(firebaseAuth);

      CookieService.remove(['isAuthenticated']);
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
