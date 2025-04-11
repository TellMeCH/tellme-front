import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { createListTagsProvider, createSearchResponseTransformer, mergeInInfiniteSearch } from '../common/utils';
import { TopicPaginationRequest } from '../topic';
import { employeeApiConfig } from './config';
import { Employee } from './models';

export const employeeApi = createAppApi({
  reducerPath: employeeApiConfig.entityName,
  tagTypes: [employeeApiConfig.entityName],
  endpoints: (builder) => ({
    getProfile: builder.query<Employee, void>({
      query: () => ({
        method: 'get',
        url: `${employeeApiConfig.baseEndpoint}me/`,
      }),
      transformResponse: (response) => plainToInstance(Employee, response as object),
    }),
    searchInfinite: builder.query<PaginationResponse<Employee>, PaginationRequest>({
      query: (params: TopicPaginationRequest) => ({
        method: 'get',
        url: employeeApiConfig.baseEndpoint,
        params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as PaginationRequest, PaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: createSearchResponseTransformer<Employee>(Employee),
      providesTags: createListTagsProvider<Employee>(employeeApiConfig.entityName),
      merge: mergeInInfiniteSearch,
    }),
  }),
});
