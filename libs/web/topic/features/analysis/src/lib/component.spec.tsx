import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import '@testing-library/jest-dom';
import {
  topicsPaginationResponse,
  TestRootComponent,
  summaryResponse,
  chartDataResponse,
  getAllByTestIdAsync,
  getByTestIdAsync,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
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
      callback: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) {
        this.callback = cb;
      }

      observe = jest.fn(() => {
        this.callback(
          [
            {
              target: document.body,
              contentRect: { width: 100, height: 100 },
              borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
            } as unknown as ResizeObserverEntry,
          ],
          this,
        );
      });

      unobserve = jest.fn();
      disconnect = jest.fn();
    };

    (global as any).DOMRect = {
      fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
    };

    global.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { method, url } = config;

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

  it('should request recent topics list', async () => {
    const trigger = await getByTestIdAsync('dropdown-trigger');
    await userEvent.click(trigger);

    const items = await getAllByTestIdAsync('dropdown-item');
    expect(items.length).toBe(topicsPaginationResponse.results.length);

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/topics/list_recent/',
        }),
      );
    });
  });

  it('should request summary data for the first topic', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${topicId}/summary_data/`,
        }),
      );
    });
  });

  it('should request trend data for the first topic', async () => {
    await waitFor(() => {
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
