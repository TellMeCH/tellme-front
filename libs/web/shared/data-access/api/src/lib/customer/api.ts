import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { omit } from 'lodash';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { createSearchResponseTransformer, mergeInInfiniteSearch } from '../common/utils';
import { customerApiConfig } from './config';
import { Customer, CustomerPaginationRequest } from './models';

export const customerApi = createAppApi({
  reducerPath: customerApiConfig.entityName,
  endpoints: (builder) => ({
    searchInfinite: builder.query<PaginationResponse<Customer>, CustomerPaginationRequest>({
      query: (params: CustomerPaginationRequest) => ({
        method: 'get',
        url: customerApiConfig.baseEndpoint,
        params: prepareRequestParams(params, CustomerPaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as CustomerPaginationRequest, CustomerPaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: createSearchResponseTransformer<Customer>(Customer),
      merge: mergeInInfiniteSearch,
    }),
  }),
});
