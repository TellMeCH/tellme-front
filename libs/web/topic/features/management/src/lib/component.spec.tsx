import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  suggestedTopicsPaginationResponse,
  TestRootComponent,
  topic,
  topicsPaginationResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { TopicsManagement } from './component';
import '@testing-library/jest-dom';
import SpyInstance = jest.SpyInstance;

const getNewTopicId = (): number => {
  const sortedTopics = topicsPaginationResponse.results.slice().sort((a, b) => a.url.localeCompare(b.url));

  if (sortedTopics.length === 0) {
    return 1;
  }

  if (sortedTopics.length === 1) {
    return getIdFromUrl(sortedTopics[0].url) + 1;
  }

  const lastTopicId = getIdFromUrl(sortedTopics[sortedTopics.length - 1].url);

  return lastTopicId + 1;
};

describe('Topics management', () => {
  let requestSpy: SpyInstance;

  const checkTopicActivityToggling = async (shouldEnable: boolean): Promise<void> => {
    const activitySwitches = await screen.findAllByTestId('activity-switch');
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
  };

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { method, url } = config;

      if (method === 'get' && url?.includes('/suggested-topics/')) {
        return Promise.resolve({ data: suggestedTopicsPaginationResponse });
      }

      if (method === 'post' && url?.includes('/suggested-topics/')) {
        const suggestedTopicId = Number(url.split('/')[2]);
        const suggestedTopic = suggestedTopicsPaginationResponse.results.find((topic) => topic.id === suggestedTopicId);
        const creationDate = new Date().toISOString();
        topicsPaginationResponse.results.push({
          name: suggestedTopic?.name as string,
          description: suggestedTopic?.description as string,
          created: creationDate,
          updated: creationDate,
          is_active: true,
          url: `https://tellme-service-716439647851.europe-west6.run.app/api/v1/topics/${getNewTopicId()}/`,
        });

        return Promise.resolve({});
      }

      switch (method) {
        case 'get': {
          return Promise.resolve({ data: topicsPaginationResponse });
        }

        case 'post': {
          const newTopicId = getNewTopicId();
          const creationDate = new Date().toISOString();
          const newTopic = {
            ...(config.data as any),
            created: creationDate,
            updated: creationDate,
          };

          topicsPaginationResponse.results.push({
            ...newTopic,
            url: `https://tellme-service-716439647851.europe-west6.run.app/api/v1/topics/${newTopicId}/`,
          });

          return Promise.resolve({
            data: {
              ...(config.data as object),
              id: newTopicId,
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
    const items = await screen.findAllByTestId('item');
    expect(items.length).toBe(topicsPaginationResponse.results.length);

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/topics/',
        params: { page_size: 20 },
      }),
    );
  });

  it('should load suggested topics initially', async () => {
    await userEvent.click(await screen.findByTestId('suggested-topics-button'));
    const items = await screen.findAllByTestId('suggested-item');
    expect(items.length).toBe(suggestedTopicsPaginationResponse.results.length);
  });

  it('should accept a suggested topic', async () => {
    await userEvent.click(await screen.findByTestId('suggested-topics-button'));
    const acceptButtons = await screen.findAllByTestId('accept-button');
    await userEvent.click(acceptButtons[0]);

    const firstSuggestedTopicId = suggestedTopicsPaginationResponse.results[0].id;
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `/suggested-topics/${firstSuggestedTopicId}/accept/`,
        }),
      );
    });

    const suggestedItems = screen.getAllByTestId('suggested-item');
    expect(suggestedItems.length).toBe(suggestedTopicsPaginationResponse.results.length - 1);

    const items = screen.getAllByTestId('item');
    expect(items.length).toBe(topicsPaginationResponse.results.length);
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
    expect(items.length).toBe(topicsPaginationResponse.results.length);
  }, 15000);

  it('should edit a topic', async () => {
    const updateModalButtons = await screen.findAllByTestId('update-modal-button');
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
  }, 15000);

  it('should delete a topic', async () => {
    const confirmationModalButtons = await screen.findAllByTestId('confirmation-modal-button');
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
  });
});
