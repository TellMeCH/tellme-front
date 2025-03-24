import { render, screen, waitFor } from '@testing-library/react';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { TestRootComponent, topicsPaginationResponse } from '@tellme/web/shared/data-access/tests-data';
import { TopicsManagement } from './component';
import '@testing-library/jest-dom';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
  onAuthStateChanged: jest.fn((_, observer) => {
    observer({ uid: 'uid', email: 'test@test.com' });
  }),
}));

describe('Topics management', () => {
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      switch (config.method) {
        case 'get': {
          return Promise.resolve({ data: topicsPaginationResponse });
        }

        default: {
          return Promise.resolve({});
        }
      }
    });
  });

  //TODO: return lodash-es

  beforeEach(() => {
    render(
      <TestRootComponent shouldAuthorize>
        <TopicsManagement />
      </TestRootComponent>,
    );
  });

  it('should load topics initially', async () => {
    await waitFor(() => {
      const items = screen.getAllByTestId('item');

      expect(items.length).toBe(topicsPaginationResponse.results.length);
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/topics/',
          params: { page_size: 10 },
        }),
      );
    });
  });

  /*

  it('should disable topic', async () => {

  });

  it('should enable topic', async () => {

  });

  it('should create an active topic', async () => {

  });

  it('should edit a topic', async () => {

  });

  it('should delete a topic', async () => {

  });*/
});
