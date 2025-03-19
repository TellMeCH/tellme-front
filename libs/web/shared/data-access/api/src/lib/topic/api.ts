import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash-es';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { topicApiConfig } from './config';
import { Topic, TopicPaginationRequest } from './models';
import { TopicUpsertRequest } from './models/upsert-request';

const getSearchQuery = ({ isActive, ...params }: TopicPaginationRequest) => ({
  method: 'get',
  url: `${topicApiConfig.baseEndpoint}${isActive ? 'list_active/' : ''}`,
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
    searchInfinite: builder.query<PaginationResponse<Topic>, TopicPaginationRequest>({
      query: getSearchQuery,
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as TopicPaginationRequest, TopicPaginationRequest),
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

        for (const { endpointName, originalArgs } of cachedQueries) {
          dispatch(
            topicApi.util.updateQueryData(
              endpointName as 'search' | 'searchInfinite' | 'get',
              originalArgs as any,
              (endpointData) => {
                if ('results' in endpointData && Array.isArray(endpointData.results)) {
                  const existingIndex = endpointData.results.findIndex((item) => item.id === arg.id);

                  if (existingIndex !== -1) {
                    const existingItem = endpointData.results[existingIndex];
                    const oldIsActive = existingItem.isActive;

                    merge(existingItem, omit(updatedEntityData, 'id'));
                    const newIsActive = existingItem.isActive;

                    if (originalArgs?.isActive && oldIsActive && !newIsActive) {
                      endpointData.results.splice(existingIndex, 1);
                    }
                  } else if (originalArgs?.isActive && updatedEntityData.isActive) {
                    const newItem = createEntityInstance(Topic, updatedEntityData);
                    endpointData.results.push(newItem);
                  }

                  endpointData.results.sort((a, b) => a.name.localeCompare(b.name));
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
