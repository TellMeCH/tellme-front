/* eslint-disable @nx/enforce-module-boundaries */
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { Customer, CustomerSummary } from '@tellme/web/shared/data-access/api';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { customer, summaryResponse, TestRootComponent, ticket } from '@tellme/web/shared/data-access/tests-data';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import customerExperienceMessages from '../../../../../../../../../i18n/web/customer-experience/en.json';
import { Suggested } from './component';
/* eslint-enable @nx/enforce-module-boundaries */
import SpyInstance = jest.SpyInstance;

describe('Suggested', () => {
  const summaryInstance = plainToInstance(CustomerSummary, summaryResponse.summary);
  let customerInstance = plainToInstance(Customer, customer);
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockImplementation((config) => {
      const { url, method } = config;

      if (url?.includes('/ticket/') && method === 'get') {
        customerInstance = plainToInstance(Customer, {
          ...customer,
          ticket_date: ticket.date,
          ticket_link: ticket.link,
        });

        return Promise.resolve({ data: ticket });
      }

      return Promise.resolve({});
    });
  });

  beforeEach(() => {
    render(
      <TestRootComponent>
        <Suggested
          customer={customerInstance}
          summary={summaryInstance}
          hasTabs />
      </TestRootComponent>,
    );
  });

  it('should have the email tab and its content selected by default', () => {
    expect(screen.getByTestId('email-tab')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('suggested-content-title')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.TEXT_EMAIL_TITLE,
    );
    expect(screen.getByTestId('suggested-content-subtitle')).toHaveTextContent(summaryInstance.suggestedEmailSubject);
    expect(screen.getByTestId('suggested-content-description')).toHaveTextContent(summaryInstance.suggestedEmailBody);
    expect(screen.getByTestId('suggested-content-button')).toHaveAttribute('href', summaryInstance.suggestedEmailLink);
    expect(screen.getByTestId('suggested-content-button')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.BUTTON_SEND_EMAIL,
    );
  });

  it('should select jira tab on select it', async () => {
    await userEvent.click(screen.getByTestId('jira-tab'));

    expect(screen.getByTestId('jira-tab')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('suggested-content-title')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.TEXT_SUGGESTED_TICKET,
    );
    expect(screen.getByTestId('suggested-content-subtitle')).toHaveTextContent(
      summaryInstance.jiraTicketTitle as string,
    );
    expect(screen.getByTestId('suggested-content-description')).toHaveTextContent(
      summaryInstance.jiraTicketBody as string,
    );
    expect(screen.getByTestId('suggested-content-button')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.BUTTON_CREATE_TICKET,
    );
  });

  it('should create a ticket', async () => {
    await userEvent.click(screen.getByTestId('jira-tab'));
    await userEvent.click(screen.getByTestId('suggested-content-button'));

    const ticketUrl = `/customers/${customerInstance.idFromUrl}/ticket/`;
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: ticketUrl,
        }),
      );
    });
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: ticketUrl,
      }),
    );
  });

  it('should show a ready ticket after its creating', async () => {
    await userEvent.click(screen.getByTestId('jira-tab'));

    expect(screen.getByTestId('suggested-content-title')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.TEXT_TICKET,
    );
    expect(screen.getByTestId('suggested-content-subtitle')).toHaveTextContent(
      `${summaryInstance.jiraTicketTitle}, ${formatDate(customerInstance.ticketDate as DateTime, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}`,
    );
    expect(screen.getByTestId('suggested-content-button')).toHaveTextContent(
      customerExperienceMessages.DETAILS.SUGGESTED.BUTTON_VIEW_TICKET,
    );
    expect(screen.getByTestId('suggested-content-button')).toHaveAttribute('href', customerInstance.ticketLink);
  });
});
