import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  TestRootComponent,
  generalOverviewResponse,
  topicsOverviewResponse,
  organization,
  summariesResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { Dashboard } from './component';

import SpyInstance = jest.SpyInstance;

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
          return Promise.resolve({ data: organization });

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

  it('should load general overview', () => {
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
      const summaryDescriptions = screen.getAllByTestId('summary-description');

      expect(summaryDescriptions.length).toBe(matchingTopics.length);
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
      const overviewItems = screen.getAllByTestId('overview-item');

      expect(overviewItems.length).toBe(Object.keys(Object.values(topicsOverviewResponse)[0]).length);
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/organizations/overview/',
        params: { per_topic: true },
      }),
    );
  });

  it('should show organization name and render formatted date range correctly', async () => {
    await waitFor(() => {
      const dateRangeItem = screen.getByTestId('date-range');
      const organizationNameItem = screen.getByTestId('organization-name');

      expect(organizationNameItem).toHaveTextContent(organization.name);
      expect(dateRangeItem).toHaveTextContent('Feb—Mar 2025');
    });
  });
});
