import { render, screen } from '@testing-library/react';
import { Login } from './component';
import userEvent from '@testing-library/user-event';
import { TestRootComponent, validCredentials } from '@tellme/web/shared/data-access/tests-data';
import Cookies from 'js-cookie';
import '@testing-library/jest-dom';
import { DateTime } from 'luxon';
import { cookieConfig } from '@tellme/web/shared/data-access/cookies';
import SpyInstance = jest.SpyInstance;

function checkCookie(setCookieSpy: SpyInstance): void {
  expect(setCookieSpy.mock.lastCall?.[0]).toEqual(cookieConfig.keys.isAuthenticated);
  expect(setCookieSpy.mock.lastCall?.[1]).toEqual('true');

  const expectedExpirationDate = DateTime.local().plus({ days: 14 }).startOf('minute');
  const expirationDateFromArgument = DateTime.fromJSDate(setCookieSpy.mock.lastCall?.[2]?.expires as Date).startOf(
    'minute',
  );
  expect(expectedExpirationDate.toString()).toEqual(expirationDateFromArgument.toString());
}

jest.mock('firebase/auth', () => {
  const authResponse = {
    user: {
      email: 'test@example.com',
      getIdToken: jest.fn(() => Promise.resolve('token')),
    },
  };

  return {
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve(authResponse)),
    setPersistence: jest.fn(() => Promise.resolve()),
    signInWithPopup: jest.fn(() => Promise.resolve(authResponse)),
    GoogleAuthProvider: jest.fn(() => ({})),
    OAuthProvider: jest.fn(() => ({})),
  };
});

describe('Login', () => {
  const onSuccessMock = jest.fn();
  const setCookieSpy = jest.spyOn(Cookies, 'set');

  beforeEach(() => {
    onSuccessMock.mockClear();
    setCookieSpy.mockClear();
    render(<Login onSuccess={onSuccessMock} />, { wrapper: TestRootComponent });
  });

  it('should authorize with valid credentials and remembering', async () => {
    await userEvent.type(screen.getByTestId('email-input'), validCredentials.email);
    await userEvent.type(screen.getByTestId('password-input'), validCredentials.password);
    await userEvent.click(screen.getByTestId('should-remember-checkbox'));
    await userEvent.click(screen.getByTestId('submit-button'));

    checkCookie(setCookieSpy);
    expect(onSuccessMock).toHaveBeenCalled();
    //Check arguments of setPersistence and signInWithEmailAndPassword
  });

  it('should authorize with valid credentials and without remembering', async () => {
    await userEvent.type(screen.getByTestId('email-input'), validCredentials.email);
    await userEvent.type(screen.getByTestId('password-input'), validCredentials.password);
    await userEvent.click(screen.getByTestId('submit-button'));

    expect(setCookieSpy).toHaveBeenCalledWith(cookieConfig.keys.isAuthenticated, 'true', { expires: undefined });
    expect(onSuccessMock).toHaveBeenCalled();
    //Check arguments of setPersistence and signInWithEmailAndPassword
  });

  it('should authorize with Google', async () => {
    await userEvent.click(screen.getByTestId('google-button'));

    checkCookie(setCookieSpy);
    expect(onSuccessMock).toHaveBeenCalled();
    //Check arguments of setPersistence signInWithPopup
  });

  it('should authorize with Microsoft', async () => {
    await userEvent.click(screen.getByTestId('microsoft-button'));

    checkCookie(setCookieSpy);
    expect(onSuccessMock).toHaveBeenCalled();
    //Check arguments of setPersistence signInWithPopup
  });
});
