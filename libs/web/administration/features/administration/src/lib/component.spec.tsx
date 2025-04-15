import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  admin,
  employeesPaginationResponse,
  nonAdmin,
  organization,
  TestRootComponent,
  topicsPaginationResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { Administration } from './component';
import '@testing-library/jest-dom';
import { EmployeeAuthType, EmployeeRole } from '@tellme/web/shared/data-access/api';
import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

describe('Administration', () => {
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      switch (config.method) {
        case 'get': {
          if (config.url?.includes('organizations')) {
            return Promise.resolve({ data: organization });
          } else if (config.url?.includes('me')) {
            return Promise.resolve({ data: admin });
          } else {
            return Promise.resolve({ data: employeesPaginationResponse });
          }
        }

        case 'post': {
          if (config.url?.includes('invite')) {
            return Promise.resolve({});
          } else {
            const lastEmployeeIndex = topicsPaginationResponse.results.length - 1;
            const sortedEmployees = topicsPaginationResponse.results.slice().sort((a, b) => a.url.localeCompare(b.url));

            return Promise.resolve({
              data: {
                ...(config.data as object),
                id: getIdFromUrl(sortedEmployees[lastEmployeeIndex].url) + 1,
                created: new Date().toISOString(),
              },
            });
          }
        }

        case 'patch': {
          const id = getIdFromUrl(config.url as string);
          const employee = topicsPaginationResponse.results.find((topic) => getIdFromUrl(topic.url) === id);

          return Promise.resolve({
            data: {
              ...employee,
              ...(config.data as object),
              id,
            },
          });
        }

        default: {
          return Promise.resolve({});
        }
      }
    });
  });

  beforeEach(() => {
    requestSpy.mockClear();
    render(
      <TestRootComponent shouldAuthorize>
        <Administration />
      </TestRootComponent>,
    );
  });

  it('should load employee profile', () => {
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/employees/me/',
      }),
    );
  });

  it('should load an organization', async () => {
    await waitFor(() => {
      const title = screen.getByTestId('title');

      expect(title).toHaveTextContent(new RegExp(organization.name.toUpperCase()));
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/organizations/${getIdFromUrl(organization.url)}/`,
      }),
    );
  });

  it('should load employees initially', async () => {
    await waitFor(() => {
      const items = screen.getAllByTestId('employee-item');

      expect(items.length).toBe(employeesPaginationResponse.results.length);
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/employees/',
        params: { page_size: 15 },
      }),
    );
  });

  it('should create an employee', async () => {
    const employeeModalButton = await screen.findByTestId('employee-modal-button');
    await userEvent.click(employeeModalButton);
    await userEvent.type(screen.getByTestId('first-name-input'), nonAdmin.user.first_name);
    await userEvent.type(screen.getByTestId('last-name-input'), nonAdmin.user.last_name);
    await userEvent.type(screen.getByTestId('email-input'), nonAdmin.user.email);
    await userEvent.click(screen.getByTestId('auth-type-select'));
    await userEvent.click(screen.getByTestId('password-select-item'));
    await userEvent.click(screen.getByTestId('role-select'));
    await userEvent.click(screen.getByTestId('analyst-select-item'));
    await userEvent.click(screen.getByTestId('admin-switch'));
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/employees/',
          data: {
            first_name: nonAdmin.user.first_name,
            last_name: nonAdmin.user.last_name,
            email: nonAdmin.user.email,
            auth_type: EmployeeAuthType.PASSWORD,
            role: EmployeeRole.ANALYST,
            isOrganizationAdmin: true,
          },
        }),
      );
    });
    const items = screen.getAllByTestId('employee-item');
    expect(items.length).toBe(topicsPaginationResponse.results.length + 1);
    expect(screen.getByTestId('employees-count')).toHaveTextContent(String(organization.employees_count + 1));
  });
});
