import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import '@testing-library/jest-dom';
import {
  getIdFromUrl,
  TestRootComponent,
  topic,
  topicsPaginationResponse,
  getAllByTestIdAsync,
} from '@tellme/web/shared/data-access/tests-data';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

describe('Topic Analysis', () => {
  let requestSpy: SpyInstance;
  const selectedTopicId = 123;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { method, url, params } = config;

      if (method !== 'get') return Promise.resolve({});

      switch (url) {
        case '/topics/list_recent/':
          return Promise.resolve({ data: topicsPaginationResponse });

        case `/organizations/${topicId}/summary_data/`:
          return Promise.resolve({ data: organizationResponse });

        case `/topics/${topicId}/trend/`:
          return Promise.resolve({ data: summariesResponse });

        default:
          return Promise.resolve({});
      }
    });
  });

  // Optional
  beforeEach(() => {
    // Actions before each test case
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
  it('should do something', () => {
    // Actions with elements and results check
  });
});
