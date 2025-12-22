import { createEntityInstance } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { createInfiniteQuery, createInfiniteQueryOptions, createSearchResponseTransformer } from '../common/utils';
import { customerApiConfig } from './config';
import { Customer, CustomerPaginationRequest, CustomerSummaryResponse } from './models';

export const customerApi = createAppApi({
  reducerPath: customerApiConfig.entityName,
  endpoints: (builder) => ({
    search: builder.infiniteQuery<PaginationResponse<Customer>, CustomerPaginationRequest, string | undefined>({
      infiniteQueryOptions: createInfiniteQueryOptions<Customer>(),
      query: createInfiniteQuery<CustomerPaginationRequest>(
        `${customerApiConfig.baseEndpoint}search/`,
        CustomerPaginationRequest,
      ),
      transformResponse: createSearchResponseTransformer<Customer>(Customer),
    }),
    get: builder.query<Customer, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'get',
          url: `${customerApiConfig.baseEndpoint}${id}/`,
        };
      },
      transformResponse: (response: object) => createEntityInstance<Customer>(Customer, response),
    }),
    getSummary: builder.query<CustomerSummaryResponse, number>({
      query: (customerId) => {
        return {
          method: 'get',
          url: `${customerApiConfig.baseEndpoint}${customerId}/summary_data/`,
        };
      },
      transformResponse: (response: object) =>
        createEntityInstance<CustomerSummaryResponse>(CustomerSummaryResponse, response),
    }),
    createSummary: builder.mutation<void, number>({
      query: (customerId) => ({
        method: 'post',
        url: `${customerApiConfig.baseEndpoint}${customerId}/summary_data/`,
      }),
    }),
    createTicket: builder.mutation<void, number>({
      query: (customerId) => ({
        method: 'get',
        url: `${customerApiConfig.baseEndpoint}${customerId}/create_ticket/`,
      }),
    }),
  }),
});
