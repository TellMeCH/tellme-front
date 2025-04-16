import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as firebase from 'firebase/auth';
import Cookies from 'js-cookie';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { admin, nonAdmin, TestRootComponent } from '@tellme/web/shared/data-access/tests-data';
import { Sidebar } from './component';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

function renderComponent(onLogoutSuccess: jest.Mock): void {
  render(<Sidebar onLogoutSuccess={onLogoutSuccess} />, {
    wrapper: (props) => <TestRootComponent {...props} shouldAuthorize />,
  });
}

describe('Sidebar', () => {
  const onLogoutSuccess = jest.fn();

  describe('common', () => {
    const logoutSpy = jest.spyOn(firebase, 'signOut');
    const removeCookieSpy = jest.spyOn(Cookies, 'remove');
    const employeeProfileRequestSpy = jest.spyOn(apiService.httpClient, 'request').mockReturnValue(Promise.resolve({}));

    beforeEach(() => {
      jest.clearAllMocks();
      renderComponent(onLogoutSuccess);
    });

    it('should load employee profile', () => {
      expect(employeeProfileRequestSpy).toHaveBeenCalled();
    });

    it('should call logout, clear cookie and call onLogoutSuccess', async () => {
      await userEvent.click(screen.getByTestId('logout-button'));

      expect(logoutSpy).toHaveBeenCalled();
      expect(removeCookieSpy).toHaveBeenCalledWith('isAuthenticated', undefined);
      expect(onLogoutSuccess).toHaveBeenCalled();
    });
  });

  describe('non-admin', () => {
    it('should have three links', async () => {
      jest.spyOn(apiService.httpClient, 'request').mockReturnValue(Promise.resolve({ data: nonAdmin }));

      renderComponent(onLogoutSuccess);

      await waitFor(() => {
        const links = screen.getAllByTestId('link');
        expect(links).toHaveLength(3);
      });
    });
  });

  describe('admin', () => {
    it('should have four links', async () => {
      jest.spyOn(apiService.httpClient, 'request').mockReturnValue(Promise.resolve({ data: admin }));

      renderComponent(onLogoutSuccess);

      await waitFor(() => {
        const links = screen.getAllByTestId('link');
        expect(links).toHaveLength(4);
      });
    });
  });
});
