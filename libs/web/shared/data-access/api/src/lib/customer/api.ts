import { createEntityInstance, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { customerApiConfig } from './config';
import { Customer, CustomerPaginationRequest, CustomerSummaryResponse } from './models';

export const customerApi = createAppApi({
  reducerPath: customerApiConfig.entityName,
  endpoints: (builder) => ({
    search: builder.infiniteQuery<PaginationResponse<Customer>, CustomerPaginationRequest, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
      query: ({ queryArg, pageParam }) => {
        return {
          method: 'get',
          url: customerApiConfig.baseEndpoint,
          params: prepareRequestParams({ ...queryArg, cursor: pageParam }, CustomerPaginationRequest),
        };
      },
      transformResponse: (response) => {
        const { results, ...rest } = plainToInstance(PaginationResponse<Customer>, response as object);

        return {
          results: results.map((item) => createEntityInstance<Customer>(Customer, item)),
          ...rest,
        } as PaginationResponse<Customer>;
      },
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
  }),
});
