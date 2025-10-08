'use client';

import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { browserLocalPersistence, browserSessionPersistence, UserCredential } from 'firebase/auth';
import { DateTime } from 'luxon';
import posthog from 'posthog-js';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { employeeApi, ErrorResponse } from '@tellme/web/shared/data-access/api';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { authConfig } from '../config';

export function useLogin(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | ErrorResponse<any>>(undefined);
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const executeLogin = async (login: () => Promise<UserCredential>, shouldRemember: boolean = true): Promise<void> => {
    try {
      setError(undefined);
      setIsLoading(true);

      await login();
      const employeeProfile = await dispatch(employeeApi.endpoints.getProfile.initiate()).unwrap();

      const expirationDate = DateTime.local().plus({ days: authConfig.authCookiesTttDays }).toJSDate();
      CookieService.set(
        {
          isAuthenticated: 'true',
          isOrganizationAdmin: String(employeeProfile.isOrganizationAdmin),
          persistence: shouldRemember ? browserLocalPersistence.type : browserSessionPersistence.type,
        },
        { expires: shouldRemember ? expirationDate : undefined },
      );
      posthog.identify('distinct_id', undefined, { email: employeeProfile.user.email });
      onSuccess();
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, executeLogin };
}
