import { createEntityInstance, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { customerApiConfig } from './config';
import { Customer, CustomerPaginationRequest } from './models';

export const customerApi = createAppApi({
  reducerPath: customerApiConfig.entityName,
  endpoints: (builder) => ({
    search: builder.infiniteQuery<PaginationResponse<Customer>, CustomerPaginationRequest, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
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

        return new PaginationResponse<Customer>({
          results: results.map((item) => createEntityInstance<Customer>(Customer, item)),
          ...rest,
        });
      },
    }),
  }),
});
