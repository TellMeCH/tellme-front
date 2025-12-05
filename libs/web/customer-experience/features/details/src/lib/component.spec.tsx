import { render, waitFor } from '@testing-library/react';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import {
  conversationsPaginationResponse,
  customer,
  detailedConversation,
  readyCustomerSummaryResponse,
  TestRootComponent,
} from '@tellme/web/shared/data-access/tests-data';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { CustomerExperienceDetails } from './component';
import SpyInstance = jest.SpyInstance;

describe('Customer experience details', () => {
  const customerId = getIdFromUrl(customer.url);
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { url } = config;

      if (url?.includes('/conversations/') && url?.includes('/customers/')) {
        return Promise.resolve({ data: conversationsPaginationResponse });
      }

      if (url?.includes('/conversations/')) {
        return Promise.resolve({ data: detailedConversation });
      }

      if (url?.includes('/summary_data/')) {
        return Promise.resolve({ data: readyCustomerSummaryResponse });
      }

      return Promise.resolve({ data: customer });
    });
  });

  beforeEach(() => {
    requestSpy.mockClear();

    render(
      <TestRootComponent shouldAuthorize>
        <CustomerExperienceDetails id={customerId} />
      </TestRootComponent>,
    );
  });

  it('should load initial data with latest conversation', async () => {
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `/customers/${customerId}/`,
        }),
      );
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/customers/${customerId}/summary_data/`,
      }),
    );

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/conversations/${getIdFromUrl(customer.latest_conversation_url)}/`,
      }),
    );

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: `/customers/${customerId}/conversations/`,
      }),
    );
  });
});
