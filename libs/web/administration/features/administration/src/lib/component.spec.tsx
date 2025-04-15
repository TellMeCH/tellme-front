import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeAuthType, EmployeeRole } from '@tellme/web/shared/data-access/api';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  admin,
  employeesPaginationResponse,
  nonAdmin,
  organization,
  TestRootComponent,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { Administration } from './component';
import '@testing-library/jest-dom';
import SpyInstance = jest.SpyInstance;

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
            const lastEmployeeIndex = employeesPaginationResponse.results.length - 1;
            const sortedEmployees = employeesPaginationResponse.results
              .slice()
              .sort((a, b) => a.url.localeCompare(b.url));

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
          const employee = employeesPaginationResponse.results.find((topic) => getIdFromUrl(topic.url) === id);

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

    await userEvent.click(screen.getByTestId('role-select'));
    await userEvent.click(screen.getByTestId('analyst-select-item'));

    await userEvent.click(screen.getByTestId('admin-switch'));
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/employees/',
          data: expect.objectContaining({
            user: {
              first_name: nonAdmin.user.first_name,
              last_name: nonAdmin.user.last_name,
              email: nonAdmin.user.email,
              auth_type: EmployeeAuthType.PASSWORD,
            },
            role: EmployeeRole.ANALYST,
            is_organization_admin: true,
          }),
        }),
      );
    });
    const items = screen.getAllByTestId('employee-item');
    expect(items.length).toBe(employeesPaginationResponse.results.length + 1);
    expect(screen.getByTestId('employees-count')).toHaveTextContent(String(organization.employee_count + 1));
  });

  it('should resend invitation to an employee', async () => {
    const employeesActions = await screen.findAllByTestId('employee-actions');
    await userEvent.click(employeesActions[0]);
    await userEvent.click(screen.getByTestId('resend-invitation-dropdown-item'));

    await waitFor(() => {
      const firstEmployeeId = getIdFromUrl(employeesPaginationResponse.results[0].url);
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `/employees/${firstEmployeeId}/invite/`,
        }),
      );
    });
  });
});
