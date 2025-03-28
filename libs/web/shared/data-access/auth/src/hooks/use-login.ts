'use client';

import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { UserCredential } from 'firebase/auth';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { employeeApi, ErrorResponse } from '@tellme/web/shared/data-access/api';
import { CookieService } from '@tellme/web/shared/data-access/cookies';

export function useLogin(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | ErrorResponse<any>>(undefined);
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const executeLogin = async (login: () => Promise<UserCredential>, shouldRemember: boolean = true): Promise<void> => {
    try {
      setError(undefined);
      setIsLoading(true);

      await login();
      await dispatch(employeeApi.endpoints.getProfile.initiate()).unwrap();

      const expirationDate = DateTime.local().plus({ days: 2 }).toJSDate();
      CookieService.set({ isAuthenticated: 'true' }, { expires: shouldRemember ? expirationDate : undefined });
      onSuccess();
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, executeLogin };
}
