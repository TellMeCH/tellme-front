import { render, screen } from '@testing-library/react';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { customersPaginationResponse, TestRootComponent } from '@tellme/web/shared/data-access/tests-data';
import { CustomerExperiencesList } from './component';
import SpyInstance = jest.SpyInstance;

describe('Customer experiences list', () => {
  let requestSpy: SpyInstance;

  beforeAll(() => {
    requestSpy = jest.spyOn(apiService.httpClient, 'request').mockResolvedValue({ data: customersPaginationResponse });
  });

  beforeEach(() => {
    requestSpy.mockClear();
    render(
      <TestRootComponent shouldAuthorize>
        <CustomerExperiencesList initialFilters={{}} onChangeFilters={jest.fn()} />
      </TestRootComponent>,
    );
  });

  it('Should load customers', async () => {
    const items = await screen.findAllByTestId('customer-item');
    expect(items.length).toBe(customersPaginationResponse.results.length);
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: '/customers/',
        params: { page_size: 10 },
      }),
    );
  });
});
