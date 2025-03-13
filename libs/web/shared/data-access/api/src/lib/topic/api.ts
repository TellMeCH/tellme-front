import { createEntityInstance, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { topicApiConfig } from './config';
import { Topic } from './models';

export const topicApi = createAppApi({
  reducerPath: topicApiConfig.entityName,
  endpoints: (builder) => ({
    search: builder.query<PaginationResponse<Topic>, PaginationRequest>({
      query: (params) => ({
        method: 'get',
        url: topicApiConfig.baseEndpoint,
        params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: (response) => {
        const { results, next, previous } = plainToInstance(PaginationResponse<Topic>, response as object);

        return {
          next,
          previous,
          results: results.map((result) => createEntityInstance<Topic>(Topic, result)),
        } as PaginationResponse<Topic>;
      },
    }),
    getActiveList: builder.query<PaginationResponse<Topic>, PaginationRequest>({
      query: (params) => ({
        method: 'get',
        url: topicApiConfig.baseEndpoint + 'list_active/',
        params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: (response) => {
        const { results, next, previous } = plainToInstance(PaginationResponse<Topic>, response as object);

        return {
          next,
          previous,
          results: results.map((result) => createEntityInstance<Topic>(Topic, result)),
        } as PaginationResponse<Topic>;
      },
      /*      providesTags: (response: PaginationResponse<Topic>) => {
      return [
        { type: topicApiConfig.entityName, id: EntityTagID.LIST },
        ...response.results.map((result) => ({ type: topicApiConfig.entityName, id: result.id })),
      ]
    },*/
    }),
  }),
});
