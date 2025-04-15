import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as firebase from 'firebase/auth';
import Cookies from 'js-cookie';
import { DateTime } from 'luxon';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { cookieConfig } from '@tellme/web/shared/data-access/cookies';
import { nonAdmin, TestRootComponent, validCredentials } from '@tellme/web/shared/data-access/tests-data';
import { Login } from './component';
import '@testing-library/jest-dom';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => {
  const authResponse = {
    user: {
      email: 'test@example.com',
      getIdToken: jest.fn(() => Promise.resolve('token')),
    },
  };

  return {
    browserLocalPersistence: { type: 'LOCAL' },
    browserSessionPersistence: { type: 'SESSION' },
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve(authResponse)),
    setPersistence: jest.fn(() => Promise.resolve()),
    signInWithPopup: jest.fn(() => Promise.resolve(authResponse)),
    GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
    OAuthProvider: jest.fn((providerId) => ({ providerId })),
  };
});

function checkCookie(setCookieSpy: SpyInstance, key: string, value: string, shouldRemember?: boolean): void {
  const callIndex = Number(key === cookieConfig.keys.isOrganizationAdmin);
  const lastCall = setCookieSpy.mock.calls[callIndex];
  expect(lastCall?.[0]).toEqual(key);
  expect(lastCall?.[1]).toEqual(value);

  if (!shouldRemember) {
    expect(lastCall[2]).toEqual({ expires: undefined });

    return;
  }

  const expectedExpirationDate = DateTime.local().plus({ days: 14 }).startOf('minute');
  const expirationDateFromArgument = DateTime.fromJSDate(lastCall?.[2]?.expires as Date).startOf('minute');
  expect(expectedExpirationDate.toString()).toEqual(expirationDateFromArgument.toString());
}

function checkAuthCookie(setCookieSpy: SpyInstance, shouldRemember?: boolean): void {
  checkCookie(setCookieSpy, cookieConfig.keys.isAuthenticated, 'true', shouldRemember);
}

function checkAdminCookie(setCookieSpy: SpyInstance, shouldRemember?: boolean): void {
  checkCookie(
    setCookieSpy,
    cookieConfig.keys.isOrganizationAdmin,
    String(nonAdmin.is_organization_admin),
    shouldRemember,
  );
}

describe('Login', () => {
  const onSuccessMock = jest.fn();
  const setCookieSpy = jest.spyOn(Cookies, 'set');
  const signInWithEmailAndPasswordSpy = jest.spyOn(firebase, 'signInWithEmailAndPassword');
  const setPersistenceSpy = jest.spyOn(firebase, 'setPersistence');
  const signInWithPopupSpy = jest.spyOn(firebase, 'signInWithPopup');
  const employeeProfileRequestSpy = jest
    .spyOn(apiService.httpClient, 'request')
    .mockReturnValue(Promise.resolve({ data: nonAdmin }));

  beforeEach(() => {
    onSuccessMock.mockClear();
    setCookieSpy.mockClear();
    signInWithEmailAndPasswordSpy.mockClear();
    setPersistenceSpy.mockClear();
    signInWithPopupSpy.mockClear();
    employeeProfileRequestSpy.mockClear();

    render(<Login onSuccess={onSuccessMock} />, { wrapper: TestRootComponent });
  });

  it('should authorize with valid credentials and remembering', async () => {
    await userEvent.type(screen.getByTestId('email-input'), validCredentials.email);
    await userEvent.type(screen.getByTestId('password-input'), validCredentials.password);
    await userEvent.click(screen.getByTestId('should-remember-checkbox'));
    await userEvent.click(screen.getByTestId('submit-button'));

    checkAuthCookie(setCookieSpy, true);
    checkAdminCookie(setCookieSpy, true);
    expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith({}, validCredentials.email, validCredentials.password);
    expect(setPersistenceSpy).toHaveBeenCalledWith({}, firebase.browserLocalPersistence);
    expect(employeeProfileRequestSpy).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should authorize with valid credentials and without remembering', async () => {
    await userEvent.type(screen.getByTestId('email-input'), validCredentials.email);
    await userEvent.type(screen.getByTestId('password-input'), validCredentials.password);
    await userEvent.click(screen.getByTestId('submit-button'));

    checkAuthCookie(setCookieSpy);
    checkAdminCookie(setCookieSpy);
    expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith({}, validCredentials.email, validCredentials.password);
    expect(setPersistenceSpy).toHaveBeenCalledWith({}, firebase.browserSessionPersistence);
    expect(employeeProfileRequestSpy).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should authorize with Google', async () => {
    await userEvent.click(screen.getByTestId('google-button'));

    checkAuthCookie(setCookieSpy, true);
    checkAdminCookie(setCookieSpy, true);
    expect(signInWithPopupSpy).toHaveBeenCalledWith({}, { providerId: 'google.com' });
    expect(employeeProfileRequestSpy).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should authorize with Microsoft', async () => {
    await userEvent.click(screen.getByTestId('microsoft-button'));

    checkAuthCookie(setCookieSpy, true);
    checkAdminCookie(setCookieSpy, true);
    expect(signInWithPopupSpy).toHaveBeenCalledWith({}, { providerId: 'microsoft.com' });
    expect(employeeProfileRequestSpy).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
  });
});
