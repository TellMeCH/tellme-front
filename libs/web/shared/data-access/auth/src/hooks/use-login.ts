'use client';

import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { employeeApi, ErrorResponse } from '@tellme/web/shared/data-access/api';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { SocialProviderName } from '../enums';
import { firebaseAuth } from '../firebase-auth';

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

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

  const loginByEmail = async (email: string, password: string, shouldRemember: boolean): Promise<void> => {
    const login = async (): Promise<UserCredential> => {
      const persistence = shouldRemember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(firebaseAuth, persistence);

      return await signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    await executeLogin(login, shouldRemember);
  };

  const loginBySocial = async (providerName: SocialProviderName): Promise<void> => {
    const login = async (): Promise<UserCredential> => {
      const provider = providerName === SocialProviderName.GOOGLE ? googleProvider : microsoftProvider;

      return await signInWithPopup(firebaseAuth, provider);
    };

    await executeLogin(login);
  };

  return { isLoading, error, loginByEmail, loginBySocial };
}
