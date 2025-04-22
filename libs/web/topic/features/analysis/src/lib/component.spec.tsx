import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrendPeriod } from '@tellme/web/shared/data-access/api';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import '@testing-library/jest-dom';
import {
  topicsPaginationResponse,
  TestRootComponent,
  summaryResponse,
  chartDataResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { TopicAnalysis } from './component';

import SpyInstance = jest.SpyInstance;

let mockedSearchParamsValue = new URLSearchParams('');

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: () => mockedSearchParamsValue,
}));

describe('Topic Analysis', () => {
  let requestSpy: SpyInstance;
  const [initialTopicId, secondTopicId] = topicsPaginationResponse.results.map((topic) => getIdFromUrl(topic.url));

  beforeAll(() => {
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
    const trigger = await screen.findByTestId('dropdown-trigger');
    await userEvent.click(trigger);

    const items = await screen.findAllByTestId('dropdown-item');
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
    const trigger = await screen.findByTestId('dropdown-trigger');
    await userEvent.click(trigger);

    const items = await screen.findAllByTestId('dropdown-item');
    const secondTopic = items[1];

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

  it('should load trend data when a trend period is updated', async () => {
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

  it('should make requests with topicKey from searchParams', async () => {
    mockedSearchParamsValue = new URLSearchParams(`topicKey=${secondTopicId}`);

    await waitFor(() => {
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
  });
});
