import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  getIdFromUrl,
  TestRootComponent,
  topic,
  topicsPaginationResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { TopicsManagement } from './component';
import '@testing-library/jest-dom';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

async function getAllByTestIdAsync(testId: string) {
  let result;
  await waitFor(async () => {
    result = screen.getAllByTestId(testId);
  });

  return result;
}

describe('Topics management', () => {
  let requestSpy: SpyInstance;

  const checkTopicActivityToggling = async (shouldEnable: boolean): Promise<void> => {
    const activitySwitches = await getAllByTestIdAsync('activity-switch');

    if (activitySwitches) {
      const topicIndex = topicsPaginationResponse.results.findIndex((topic) => topic.is_active !== shouldEnable);
      await userEvent.click(activitySwitches[topicIndex]);

      const topic = topicsPaginationResponse.results[topicIndex];
      const topicId = getIdFromUrl(topic.url);
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'patch',
            url: `/topics/${topicId}/`,
            data: expect.objectContaining({ is_active: shouldEnable }),
          }),
        );
      });
    }
  };

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      switch (config.method) {
        case 'get': {
          return Promise.resolve({ data: topicsPaginationResponse });
        }

        case 'post': {
          const lastTopicIndex = topicsPaginationResponse.results.length - 1;
          const sortedTopics = topicsPaginationResponse.results.slice().sort((a, b) => a.url.localeCompare(b.url));

          return Promise.resolve({
            data: {
              ...(config.data as object),
              id: getIdFromUrl(sortedTopics[lastTopicIndex].url) + 1,
              created: new Date().toISOString(),
            },
          });
        }

        case 'patch': {
          const id = getIdFromUrl(config.url as string);
          const topic = topicsPaginationResponse.results.find((topic) => getIdFromUrl(topic.url) === id);

          return Promise.resolve({
            data: {
              ...topic,
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
        <TopicsManagement />
      </TestRootComponent>,
    );
  });

  it('should load topics initially', async () => {
    await waitFor(() => {
      const items = screen.getAllByTestId('item');

      expect(items.length).toBe(topicsPaginationResponse.results.length);
    });
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/topics/',
        params: { page_size: 10 },
      }),
    );
  });

  it('should disable topic', async () => {
    await checkTopicActivityToggling(false);
  });

  it('should enable topic', async () => {
    await checkTopicActivityToggling(true);
  });

  it('should create a topic', async () => {
    await userEvent.click(screen.getByTestId('creation-modal-button'));
    await userEvent.click(screen.getByTestId('creation-activity-switch'));
    await userEvent.type(screen.getByTestId('name-input'), topic.name);
    await userEvent.type(screen.getByTestId('description-input'), topic.description);
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/topics/',
          data: { is_active: true, name: topic.name, description: topic.description },
        }),
      );
    });
    const items = screen.getAllByTestId('item');
    expect(items.length).toBe(topicsPaginationResponse.results.length + 1);
  });

  it('should edit a topic', async () => {
    const updateModalButtons = await getAllByTestIdAsync('update-modal-button');

    if (updateModalButtons) {
      await userEvent.click(updateModalButtons[0]);

      const nameInput = screen.getByTestId('name-input');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, topic.name);

      const descriptionInput = screen.getByTestId('description-input');
      await userEvent.clear(descriptionInput);
      await userEvent.type(screen.getByTestId('description-input'), topic.description);

      await userEvent.click(screen.getByTestId('submit-button'));

      const firstTopic = topicsPaginationResponse.results[0];
      const firstTopicId = getIdFromUrl(firstTopic.url);
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'patch',
            url: `/topics/${firstTopicId}/`,
            data: expect.objectContaining({
              name: topic.name,
              description: topic.description,
            }),
          }),
        );
      });
    }
  });

  it('should delete a topic', async () => {
    const confirmationModalButtons = await getAllByTestIdAsync('confirmation-modal-button');

    if (confirmationModalButtons) {
      await userEvent.click(confirmationModalButtons[0]);
      await userEvent.click(screen.getByTestId('confirm-button'));

      const firstTopic = topicsPaginationResponse.results[0];
      const firstTopicId = getIdFromUrl(firstTopic.url);
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'delete',
            url: `/topics/${firstTopicId}/`,
          }),
        );
      });
      const items = screen.getAllByTestId('item');
      expect(items.length).toBe(topicsPaginationResponse.results.length - 1);
    }
  });
});
