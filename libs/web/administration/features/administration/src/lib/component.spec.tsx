import { render, screen, waitFor } from '@testing-library/react';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  TestRootComponent,
  topicsPaginationResponse,
  employeesPaginationResponse,
  admin,
  organization,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import '@testing-library/jest-dom';
import { Administration } from './component';

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
});
