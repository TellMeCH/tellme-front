import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
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
      transformResponse: (response: PaginationResponse<Employee>) => {
        const { results, next, previous } = plainToInstance(PaginationResponse<Employee>, response as object);

        return new PaginationResponse<Employee>({
          next,
          previous,
          results: results.map((result) => createEntityInstance<Employee>(Employee, result)),
        });
      },
      providesTags: (response?: PaginationResponse<Employee>) => [
        { type: employeeApiConfig.entityName, id: EntityTagID.LIST },
        ...(response?.results.map((result) => ({ type: employeeApiConfig.entityName, id: result.id })) || []),
      ],
      merge: (cache, response, { arg }) => {
        if (!arg.cursor) {
          cache.results = response.results;
          cache.next = response.next;
          cache.previous = response.previous;
        } else {
          const fetchedItemsIDs = response.results.map((item) => item.id);
          cache.results = cache.results.filter((item) => !fetchedItemsIDs.includes(item.id));

          if (arg.cursor === cache.nextCursor) {
            cache.results.push(...response.results);
            cache.next = response.next;
          }

          if (arg.cursor === cache.previousCursor) {
            cache.results.unshift(...response.results);
            cache.previous = response.previous;
          }
        }
      },
    }),
  }),
});
