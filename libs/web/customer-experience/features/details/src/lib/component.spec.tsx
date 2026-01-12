import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  admin,
  conversationsPaginationResponse,
  customer,
  detailedConversation,
  organization,
  readyCustomerSummaryResponse,
  TestRootComponent,
  transcriptPaginationResponse,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { CustomerExperienceDetails } from './component';
import '@testing-library/jest-dom';
import SpyInstance = jest.SpyInstance;

function renderComponent(customerId: number, conversationId?: number): void {
  render(
    <TestRootComponent shouldAuthorize>
      <CustomerExperienceDetails id={customerId} conversationId={conversationId} />
    </TestRootComponent>,
  );
}

describe('Customer experience details', () => {
  const customerId = getIdFromUrl(customer.url);
  const latestConversationId = getIdFromUrl(customer.latest_conversation_url);
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { url } = config;

      if (url?.includes('/conversations/') && url?.includes('/customers/')) {
        return Promise.resolve({ data: conversationsPaginationResponse });
      }

      if (url?.includes('/transcript/')) {
        return Promise.resolve({ data: transcriptPaginationResponse });
      }

      if (url?.includes('/conversations/')) {
        return Promise.resolve({ data: detailedConversation });
      }

      if (url?.includes('/summary_data/')) {
        return Promise.resolve({ data: readyCustomerSummaryResponse });
      }

      if (url?.includes('/customers/')) {
        return Promise.resolve({ data: customer });
      }

      if (url?.includes('/organizations/')) {
        return Promise.resolve({ data: organization });
      }

      if (url?.includes('/me/')) {
        return Promise.resolve({ data: admin });
      }

      return Promise.resolve({});
    });
  });

  describe('common', () => {
    beforeEach(() => {
      requestSpy.mockClear();
      renderComponent(customerId);
    });

    it('should load initial data', async () => {
      await waitFor(
        () => {
          expect(requestSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'get',
              url: `/conversations/${latestConversationId}/`,
            }),
          );
        },
        { timeout: 15000 },
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/customers/${customerId}/`,
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/customers/${customerId}/summary_data/`,
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/customers/${customerId}/conversations/`,
        }),
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/employees/me/`,
        }),
      );

      const organizationId = getIdFromUrl(organization.url);
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/organizations/${organizationId}/`,
        }),
      );
    });

    it('should not have a detailed conversation among other conversations', async () => {
      const otherConversationsItems = await screen.findAllByTestId('other-conversation-item');
      expect(otherConversationsItems.length).toBe(conversationsPaginationResponse.results.length - 1);
    });
  });

  describe('with latest conversations', () => {
    it('should load transcript of the latest conversation', async () => {
      requestSpy.mockClear();
      renderComponent(customerId);

      await userEvent.click(await screen.findByTestId('toggle-transcript-button'));

      const messagesItems = await screen.findAllByTestId('message');
      expect(messagesItems.length).toBe(transcriptPaginationResponse.results.length);
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/conversations/${getIdFromUrl(customer.latest_conversation_url)}/transcript/`,
          params: { page_size: 10 },
        }),
      );
    });
  });

  describe('with selected conversation', () => {
    const selectedConversationId = getIdFromUrl(conversationsPaginationResponse.results[1].url);

    beforeEach(() => {
      requestSpy.mockClear();
      renderComponent(customerId, selectedConversationId);
    });

    it('should load a detailed selected conversation', async () => {
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `/conversations/${selectedConversationId}/`,
          }),
        );
      });
    });

    it('should load transcript of the selected conversation', async () => {
      await userEvent.click(await screen.findByTestId('toggle-transcript-button'));

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/conversations/${selectedConversationId}/transcript/`,
          params: { page_size: 10 },
        }),
      );
    });
  });
});
