import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  TestRootComponent,
  generalOverviewResponse,
  topicsOverviewResponse,
  organizationResponse,
  summariesResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { Dashboard } from './component';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

describe('Dashboard', () => {
  let requestSpy: SpyInstance;
  const organizationId = Object.keys(generalOverviewResponse)[0];

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { method, url, params } = config;

      if (method !== 'get') return Promise.resolve({});

      switch (url) {
        case '/organizations/overview/':
          return Promise.resolve({
            data: params?.perTopic ? topicsOverviewResponse : generalOverviewResponse,
          });

        case `/organizations/${organizationId}/`:
          return Promise.resolve({ data: organizationResponse });

        case '/topics/all_summaries/':
          return Promise.resolve({ data: summariesResponse });

        default:
          return Promise.resolve({});
      }
    });
  });

  beforeEach(() => {
    requestSpy.mockClear();
    render(
      <TestRootComponent shouldAuthorize>
        <Dashboard />
      </TestRootComponent>,
    );
  });

  it('should load initially', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/organizations/overview/',
          params: { per_topic: false },
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/organizations/${organizationId}/`,
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/organizations/overview/',
          params: { per_topic: true },
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/topics/all_summaries/',
        }),
      );
    });

    expect(requestSpy).toHaveBeenCalledTimes(4);
  });

  afterEach(() => {
    console.log(
      requestSpy.mock.calls.map(([config]) => ({
        method: config.method,
        url: config.url,
        params: config.params,
      })),
    );
  });
});
