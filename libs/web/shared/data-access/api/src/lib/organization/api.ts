import { createEntityInstance, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { plainToInstance } from 'class-transformer';
import { PaginationRequest, PaginationResponse } from '../common';
import { organizationApiConfig } from './config';
import { Topic } from './models';

export const organizationApi = createAppApi({
  reducerPath: organizationApiConfig.entityName,
  endpoints: (builder) => ({
    getOverviewData: builder.query<any, any>({
      query: (params) => ({
        method: 'get',
        url: organizationApiConfig.baseEndpoint + 'overview/',
        //params: prepareRequestParams(params, PaginationRequest),
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
    getOrganizations: builder.query<any, any>({
      query: (params) => ({
        method: 'get',
        url: organizationApiConfig.baseEndpoint,
        //params: prepareRequestParams(params, PaginationRequest),
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
  }),
});
