import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import '@testing-library/jest-dom';
import {
  topicsPaginationResponse,
  TestRootComponent,
  summaryResponse,
  chartDataResponse,
  getAllByTestIdAsync,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { TopicAnalysis } from './component';

import SpyInstance = jest.SpyInstance;
import { TrendPeriod } from '@tellme/web/shared/data-access/api';

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
  const [initialTopicId, secondTopicId] = topicsPaginationResponse.results.map((topic) => getIdFromUrl(topic.url));

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

        case `/topics/${initialTopicId}/summary_data/`:
        case `/topics/${secondTopicId}/summary_data/`:
          return Promise.resolve({ data: summaryResponse });

        case `/topics/${initialTopicId}/trend/`:
        case `/topics/${secondTopicId}/trend/`:
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

  it('should load topic list initially', async () => {
    const trigger = await waitFor(() => screen.getByTestId('dropdown-trigger'));
    await userEvent.click(trigger);

    const items = await getAllByTestIdAsync('dropdown-item');
    expect(items.length).toBe(topicsPaginationResponse.results.length);

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/topics/list_recent/',
      }),
    );
  });

  it('should load summary initially', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${initialTopicId}/summary_data/`,
        }),
      );
    });
  });

  it('should load chart data initially', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${initialTopicId}/trend/`,
        }),
      );
    });
  });

  it('should load summary and chart data when a new topic is selected', async () => {
    const trigger = await waitFor(() => screen.getByTestId('dropdown-trigger'));
    await userEvent.click(trigger);

    const items = await getAllByTestIdAsync('dropdown-item');
    const secondTopic = items[1];
    console.log(secondTopicId);
    fireEvent.click(secondTopic);

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/topics/${secondTopicId}/summary_data/`,
      }),
    );

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/topics/${secondTopicId}/trend/`,
      }),
    );
  });

  it('should load trend data with updated trendPeriod when changed', async () => {
    const selectedTrendPeriod = Object.values(TrendPeriod)[1];
    const periodButton = await screen.findByTestId(`period-button-${selectedTrendPeriod}`);
    await userEvent.click(periodButton);

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/topics/${initialTopicId}/trend/`,
          params: expect.objectContaining({ trend_period: selectedTrendPeriod }),
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
