import { render, waitFor } from '@testing-library/react';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import '@testing-library/jest-dom';
import {
  topicsPaginationResponse,
  TestRootComponent,
  getIdFromUrl,
  summaryResponse,
  chartDataResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { TopicAnalysis } from './component';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: () => new URLSearchParams(''),
}));

describe('Topic Analysis', () => {
  let requestSpy: SpyInstance;
  const [topicId, newTopicId] = topicsPaginationResponse.results.map((topic) => getIdFromUrl(topic.url));

  beforeAll(() => {
    global.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };

    global.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { method, url, params } = config;

      if (method !== 'get') return Promise.resolve({});

      switch (url) {
        case '/topics/list_recent/':
          return Promise.resolve({ data: topicsPaginationResponse });

        case `/topics/${topicId}/summary_data/`:
        case `/topics/${newTopicId}/summary_data/`:
          return Promise.resolve({ data: summaryResponse });

        case `/topics/${topicId}/trend/`:
        case `/topics/${newTopicId}/trend/`:
          return Promise.resolve({ data: chartDataResponse });

        default:
          return Promise.resolve({});
      }
    });
  });

  beforeEach(() => {
    requestSpy.mockClear();
    render(
      <TestRootComponent shouldAuthorize>
        <TopicAnalysis />
      </TestRootComponent>,
    );
  });

  it('should load recent topics, summary and trend data initially', async () => {
    //mockUseSearchParams.mockReturnValue(new URLSearchParams(''));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/topics/list_recent/',
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${topicId}/summary_data/`,
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${topicId}/trend/`,
        }),
      );
    });
  });

  // Optional
  afterAll(() => {
    // Set up mocks and make other preparations actual for all test cases
  });

  // Optional
  afterEach(() => {
    // Actions after each test case
  });

  // Test cases
  afterEach(() => {
    console.log(
      '👉 Called API requests:',
      requestSpy.mock.calls.map(([config]) => ({
        method: config.method,
        url: config.url,
        params: config.params,
      })),
    );
  });
});
