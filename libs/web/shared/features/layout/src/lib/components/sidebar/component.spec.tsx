import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as firebase from 'firebase/auth';
import Cookies from 'js-cookie';
import { TestRootComponent } from '@tellme/web/shared/data-access/tests-data';
import { Sidebar } from './component';

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Logout', () => {
  const logoutSpy = jest.spyOn(firebase, 'signOut');
  const onLogoutSuccess = jest.fn();
  const removeCookieSpy = jest.spyOn(Cookies, 'remove');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call logout, clear cookie and call onLogoutSuccess', async () => {
    render(<Sidebar onLogoutSuccess={onLogoutSuccess} />, {
      wrapper: (props) => <TestRootComponent {...props} shouldAuthorize />,
    });

    await userEvent.click(screen.getByTestId('logout-button'));

    expect(logoutSpy).toHaveBeenCalled();
    expect(removeCookieSpy).toHaveBeenCalledWith('isAuthenticated', undefined);
    expect(onLogoutSuccess).toHaveBeenCalled();
  });
});
