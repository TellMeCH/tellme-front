import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash-es';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { topicApiConfig } from './config';
import { Topic } from './models';
import { TopicUpsertRequest } from './models/upsert-request';

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
    get: builder.query<Topic, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/`,
        };
      },
      transformResponse: (response: object) => createEntityInstance<Topic>(Topic, response),
      providesTags: ((response?: Topic) => ({ type: topicApiConfig.entityName, id: response?.id })) as any,
    }),
    update: builder.mutation<Partial<TopicUpsertRequest>, Partial<TopicUpsertRequest>>({
      query: (params) => {
        const updatedEntity = createEntityInstance(TopicUpsertRequest, params, {
          fromInstancePartial: true,
        });
        const request = instanceToPlain(updatedEntity);

        return {
          method: 'patch',
          url: `${topicApiConfig.baseEndpoint}${request.id}/`,
          data: request,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, getState, dispatch }) {
        const updatedEntityData = (await queryFulfilled).data;

        const cachedQueries = topicApi.util.selectInvalidatedBy(getState(), [
          { type: topicApiConfig.entityName, id: arg.id },
          { type: topicApiConfig.entityName, id: EntityTagID.LIST },
        ]);

        // TODO: if isActive is changed to false, remove a topic from the list with active topics
        // if isActive is changed to true, add a topic to the list with active topics and sort it by name ascending
        // Or refetch the list in both cases

        for (const { endpointName, originalArgs } of cachedQueries) {
          dispatch(
            topicApi.util.updateQueryData(
              endpointName as 'search' | 'searchInfinite' | 'get',
              originalArgs as any,
              (endpointData) => {
                if ('results' in endpointData && Array.isArray(endpointData.results)) {
                  const existingItemIndex = endpointData.results.findIndex((item) => item.id === arg.id);

                  if (existingItemIndex > -1) {
                    endpointData.results[existingItemIndex] = merge(
                      endpointData.results[existingItemIndex],
                      omit(updatedEntityData, 'id'),
                    );
                  }
                } else {
                  merge(endpointData as Topic, omit(updatedEntityData, 'id'));
                }
              },
            ),
          );
        }
      },
      transformResponse: (response) => createEntityInstance<Topic>(Topic, response),
    }),
  }),
});
