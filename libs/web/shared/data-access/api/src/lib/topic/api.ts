import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash-es';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { topicApiConfig } from './config';
import { Topic } from './models';

const getSearchQuery = (params: PaginationRequest) => ({
  method: 'get',
  url: topicApiConfig.baseEndpoint,
  params: prepareRequestParams(params, PaginationRequest),
});

const getListTags = (response?: PaginationResponse<Topic>) => [
  { type: topicApiConfig.entityName, id: EntityTagID.LIST },
  ...(response?.results.map((result) => ({ type: topicApiConfig.entityName, id: result.id })) || []),
];

const transformSearchResponse = (response: PaginationResponse<Topic>) => {
  const { results, next, previous } = plainToInstance(PaginationResponse<Topic>, response as object);

  return {
    next,
    previous,
    results: results.map((result) => createEntityInstance<Topic>(Topic, result)),
  } as PaginationResponse<Topic>;
};

export const topicApi = createAppApi({
  reducerPath: topicApiConfig.entityName,
  tagTypes: [topicApiConfig.entityName],
  endpoints: (builder) => ({
    search: builder.query<PaginationResponse<Topic>, PaginationRequest>({
      query: getSearchQuery,
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
    }),
    searchInfinite: builder.query<PaginationResponse<Topic>, PaginationRequest>({
      query: getSearchQuery,
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as PaginationRequest, PaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
      merge: (cache, response, { arg }) => {
        if (!arg.cursor) {
          cache.results = response.results;
          cache.next = response.next;
          cache.previous = response.previous;
        } else {
          const fetchedItemsIDs = response.results.map((item) => item.id);
          cache.results = cache.results.filter((item) => !fetchedItemsIDs.includes(item.id));

          if (arg.cursor === response.nextCursor) {
            cache.results.push(...response.results);
            cache.next = response.next;
          }

          if (arg.cursor === response.previousCursor) {
            cache.results.unshift(...response.results);
            cache.previous = response.previous;
          }
        }
      },
    }),
  }),
});
