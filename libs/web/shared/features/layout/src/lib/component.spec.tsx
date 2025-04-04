import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as authHooks from '@tellme/web/shared/data-access/auth';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { TestRootComponent } from '@tellme/web/shared/data-access/tests-data';
import { Sidebar } from './components';

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

jest.mock('@tellme/web/shared/data-access/auth', () => ({
  ...jest.requireActual('@tellme/web/shared/data-access/auth'),
  useLogout: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Logout', () => {
  const logoutFn = jest.fn();
  const onLogoutSuccess = jest.fn();
  const removeCookieSpy = jest.spyOn(CookieService, 'remove');

  beforeEach(() => {
    jest.clearAllMocks();

    (authHooks.useLogout as jest.Mock).mockImplementation((successCallback: () => void) => ({
      logout: () => {
        CookieService.remove(['isAuthenticated']);
        logoutFn();
        successCallback();
      },
      isLoading: false,
    }));
  });

  it('should call logout, clear cookie and call onLogoutSuccess', async () => {
    render(<Sidebar onLogoutSuccess={onLogoutSuccess} />, {
      wrapper: (props) => <TestRootComponent {...props} shouldAuthorize />,
    });

    await userEvent.click(screen.getByTestId('logout-button'));

    expect(logoutFn).toHaveBeenCalled();
    expect(removeCookieSpy).toHaveBeenCalledWith(['isAuthenticated']);
    expect(onLogoutSuccess).toHaveBeenCalled();
  });
});
