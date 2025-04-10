import { screen, render, waitFor } from '@testing-library/react';
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
            data: params?.per_topic ? topicsOverviewResponse : generalOverviewResponse,
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

  it('should load general overview and organization initially', () => {
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/organizations/overview/',
        params: { per_topic: false },
      }),
    );
  });

  it('should load organization initially', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/organizations/${organizationId}/`,
        }),
      );
    });
  });

  it('should load summaries initially', async () => {
    const topicsOverview = Object.values(topicsOverviewResponse)[0];

    const matchingTopics = Object.keys(topicsOverview).filter((topicName) => {
      const summary = Object.values(summariesResponse).find((summary) => summary.name === topicName);

      const hasReasonsDescription = summary?.summary?.['Reasons for Calling'];

      return Boolean(hasReasonsDescription);
    });

    await waitFor(() => {
      const items = screen.getAllByTestId('summary-description');

      expect(items.length).toBe(matchingTopics.length);
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/topics/all_summaries/',
      }),
    );
  });

  it('should load topics overview initially', async () => {
    await waitFor(() => {
      const items = screen.getAllByTestId('overview-item');

      expect(items.length).toBe(Object.keys(Object.values(topicsOverviewResponse)[0]).length);
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/organizations/overview/',
        params: { per_topic: true },
      }),
    );
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
