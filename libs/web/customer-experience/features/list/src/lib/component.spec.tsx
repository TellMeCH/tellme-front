import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { customersPaginationResponse, TestRootComponent } from '@tellme/web/shared/data-access/tests-data';
import { CustomerExperiencesList } from './component';
import SpyInstance = jest.SpyInstance;

describe('Customer experiences list', () => {
  let requestSpy: SpyInstance;
  const onChangeFilters = jest.fn();

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockResolvedValue({ data: customersPaginationResponse });
  });

  beforeEach(() => {
    onChangeFilters.mockClear();
    requestSpy.mockClear();

    render(
      <TestRootComponent shouldAuthorize>
        <CustomerExperiencesList initialFilters={{}} onChangeFilters={onChangeFilters} />
      </TestRootComponent>,
    );
  });

  it('should load initial customers initially', async () => {
    const items = await screen.findAllByTestId('customer-item');
    expect(items.length).toBe(customersPaginationResponse.results.length);
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/customers/search/',
        params: { page_size: 10, ordering: '-last_conversation_date' },
      }),
    );
  });

  it('should change order', async () => {
    const ordering = 'total_revenue';

    await userEvent.click(screen.getByTestId('ordering-select'));
    await userEvent.click(screen.getByTestId(`${ordering}-select-item`));

    expect(onChangeFilters).toHaveBeenCalledWith(expect.objectContaining({ ordering }));
  });

  it('should filter by query', async () => {
    const query = 'Albert';

    await userEvent.type(screen.getByTestId('search-input'), query);

    await waitFor(() => {
      expect(onChangeFilters).toHaveBeenCalledWith(expect.objectContaining({ query }));
    });
  });
});
