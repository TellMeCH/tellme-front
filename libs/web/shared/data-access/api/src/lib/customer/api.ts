import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { createInfiniteQueryOptions, createSearchResponseTransformer } from '../common/utils';
import { customerApiConfig } from './config';
import { Customer, CustomerPaginationRequest } from './models';

export const customerApi = createAppApi({
  reducerPath: customerApiConfig.entityName,
  endpoints: (builder) => ({
    search: builder.infiniteQuery<PaginationResponse<Customer>, CustomerPaginationRequest, string | undefined>({
      infiniteQueryOptions: createInfiniteQueryOptions<Customer>(),
      query: ({ queryArg, pageParam }) => ({
        method: 'get',
        url: `${customerApiConfig.baseEndpoint}${queryArg.query ? 'search/' : ''}`,
        params: prepareRequestParams({ ...queryArg, cursor: pageParam }, CustomerPaginationRequest),
      }),
      transformResponse: createSearchResponseTransformer<Customer>(Customer),
    }),
  }),
});
