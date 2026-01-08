'use client';

import { signOut } from 'firebase/auth';
import posthog from 'posthog-js';
import { useState } from 'react';
import { ErrorResponse } from '@tellme/web/shared/data-access/api';
import { firebaseAuth } from '../firebase-auth';
import { useLocalLogout } from './use-local-logout';

export function useLogout(onSuccess: () => void): typeof result {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | ErrorResponse<any>>(undefined);
  const logoutLocally = useLocalLogout();

  const logout = async (): Promise<void> => {
    try {
      setError(undefined);
      setIsLoading(true);
      await signOut(firebaseAuth);

      posthog.reset();
      logoutLocally();
      onSuccess();
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const result = { isLoading, error, logout };

  return result;
}
